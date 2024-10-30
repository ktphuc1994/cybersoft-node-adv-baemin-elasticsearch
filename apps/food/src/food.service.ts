import { PrismaService } from '@app/shared/prisma/prisma.service';
import {
  CheckStockRequest,
  CheckStockResponse,
  Food,
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

@Injectable()
export class FoodService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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
