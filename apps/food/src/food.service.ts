import { PrismaService } from '@app/shared/prisma/prisma.service';
import {
  CheckStockRequest,
  CheckStockResponse,
  Food,
  FoodElasticRequest,
  FoodRequest,
  TodayFood,
  UpdateFoodRequest,
  ValidateFoodInStoreRequest,
} from '@app/shared/schema/food.schema';
import { filterPageAndPageSize } from '@app/shared/utils/common';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FOOD_TAGS } from './constants/food.const';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { REDIS_TODAY_FOOD } from './constants/redis-key.const';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { FOOD_INDEX } from '@app/shared/constants/elastic-index.const';

@Injectable()
export class FoodService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private elasticService: ElasticsearchService,
  ) {}

  async populateElasticData(isForceUpdate: boolean) {
    const isIndexExist = await this.elasticService.indices.exists({
      index: FOOD_INDEX,
    });
    if (isIndexExist && !isForceUpdate)
      return 'Đã có sẵn Food trong Elasticsearch';

    // xóa index nếu đã tồn tại
    if (isIndexExist) {
      await this.elasticService.indices.delete({ index: FOOD_INDEX });
    }

    // tạo index nếu chưa có
    if (!isIndexExist) {
      await this.elasticService.indices.create({
        index: FOOD_INDEX,
        mappings: {
          properties: {
            food_id: { type: 'integer' },
            name: { type: 'keyword' },
            image: { type: 'text' },
            store_id: { type: 'integer' },
            price: { type: 'integer' },
            stock: { type: 'integer' },
            description: { type: 'text' },
            tags: { type: 'nested' },
          },
        },
      });
    }

    // tạo document bulk
    const foodList = await this.prismaService.food.findMany({
      omit: { created_at: true, updated_at: true },
    });
    const operations = foodList.flatMap((foodInfo) => [
      { index: { _index: FOOD_INDEX } },
      foodInfo,
    ]);
    const bulkResponse = await this.elasticService.bulk({
      operations,
      refresh: true,
    });

    if (bulkResponse.errors) {
      const erroredDocuments: any[] = [];
      // The items array has the same order of the dataset we just indexed.
      // The presence of the `error` key indicates that the operation
      // that we did for the document has failed.
      bulkResponse.items.forEach((action, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            // If the status is 429 it means that you can retry the document,
            // otherwise it's very likely a mapping error, and you should
            // fix the document before to try it again.
            status: action[operation].status,
            error: action[operation].error,
            operation: operations[i * 2],
            document: operations[i * 2 + 1],
          });
        }
      });
      console.log(erroredDocuments);
    }

    const count = await this.elasticService.count({ index: FOOD_INDEX });
    return `Đã thêm Food vào elasticsearch. Số lượng: ${count.count}`;
  }

  async getFoodWithElastic(filter: FoodElasticRequest): Promise<Food[]> {
    const isIndexExist = await this.elasticService.indices.exists({
      index: FOOD_INDEX,
    });
    if (!isIndexExist) {
      await this.populateElasticData(false);
    }

    const takeSkip = filterPageAndPageSize(filter.page, filter.pageSize);
    const nameQuery = filter.foodName
      ? { match: { name: filter.foodName } }
      : { match_all: {} };
    const storeQuery = filter.storeId
      ? { term: { store_id: filter.storeId } }
      : { match_all: {} };

    const elasticResult = await this.elasticService.search<Food>({
      index: FOOD_INDEX,
      from: takeSkip.skip,
      size: takeSkip.take,
      query: {
        bool: {
          must: [{ ...nameQuery }, { ...storeQuery }],
        },
      },
    });

    let result: Food[] = [];

    elasticResult.hits.hits.forEach((elasticHit) => {
      if (!elasticHit._source) return;
      result.push(elasticHit._source);
    });

    return result;
  }

  getFood(foodFilter: FoodRequest): Promise<Food[]> {
    const takeSkip = filterPageAndPageSize(
      foodFilter.page,
      foodFilter.pageSize,
    );
    const menuFoodFilter = foodFilter.menuId
      ? { menu_food: { some: { menu_id: foodFilter?.menuId } } }
      : {};

    return this.prismaService.food.findMany({
      where: {
        name: { contains: foodFilter?.foodName, mode: 'insensitive' },
        store_id: foodFilter?.storeId,
        ...menuFoodFilter,
      },
      ...takeSkip,
    });
  }

  async getTodayFood(): Promise<TodayFood[]> {
    const cacheTodayFood =
      await this.cacheManager.get<TodayFood[]>(REDIS_TODAY_FOOD);
    if (cacheTodayFood) return cacheTodayFood;

    const todayFood = await this.prismaService.$queryRaw<TodayFood[]>`
      SELECT
      food.food_id,
      food.name,
      food.image,
      store.name AS store_name,
      store.address AS store_address,
      store.store_id As store_id
      FROM food
      JOIN store ON food.store_id = store.store_id
      WHERE ${FOOD_TAGS.TODAY} = ANY(food.tags);
    `;

    this.cacheManager.set(REDIS_TODAY_FOOD, todayFood);
    return todayFood;
  }

  async getFoodDetail(food_id: number) {
    const foodInfo = await this.prismaService.food.findFirst({
      where: { food_id },
    });
    if (!foodInfo) throw new BadRequestException('Món ăn không tồn tại.');

    return foodInfo;
  }

  async checkStock(
    requestInfo: CheckStockRequest[],
  ): Promise<CheckStockResponse[]> {
    const foodQuantity: Record<number, number> = {};
    const foodIdList: number[] = [];
    for (const foodInfo of requestInfo) {
      foodQuantity[foodInfo.food_id] = foodInfo.quantity;
      foodIdList.push(foodInfo.food_id);
    }

    const foodList = await this.prismaService.food.findMany({
      where: { food_id: { in: foodIdList } },
      select: { food_id: true, name: true, stock: true },
    });

    if (foodList.length === 0)
      throw new BadRequestException('Món ăn không tồn tại.');
    if (foodIdList.length !== requestInfo.length)
      throw new BadRequestException(
        'Danh sách có món ăn không tồn tại hoặc bị trùng lập.',
      );

    let errorMessage = '';
    const FoodQuantityAndStock = foodList.map(
      ({ food_id, name: foodName, stock }) => {
        const quantity = foodQuantity[food_id];
        if (stock < quantity) {
          errorMessage += `${foodName} (id: ${food_id}) không đủ hàng,`;
        }
        return { food_id, stock, quantity };
      },
    );

    if (errorMessage) throw new BadRequestException(errorMessage);

    return FoodQuantityAndStock;
  }

  async validateFoodInStore(
    validateRequest: ValidateFoodInStoreRequest,
  ): Promise<ValidateFoodInStoreRequest> {
    const { foodIds, storeId } = validateRequest;
    const foodList = await this.prismaService.food.findMany({
      where: { store_id: storeId, food_id: { in: foodIds } },
      select: { food_id: true },
    });

    if (foodList.length === 0 || foodList.length !== foodIds.length)
      throw new BadRequestException(
        'Món ăn (foodIds) và cửa hàng (storeId) không trùng khớp',
      );
    return validateRequest;
  }

  async updateFood({ food_id, ...updateData }: UpdateFoodRequest) {
    return this.prismaService.food.update({
      where: { food_id },
      data: updateData,
    });
  }
}
