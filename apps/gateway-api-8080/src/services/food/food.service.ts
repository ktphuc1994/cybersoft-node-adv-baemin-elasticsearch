import { FOOD_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { FOOD_SERVICE_NAME } from '@app/shared/constants/microservice.const';
import {
  Food,
  FoodElasticRequest,
  FoodRequest,
  TodayFood,
} from '@app/shared/schema/food.schema';
import { StoreAndMenu } from '@app/shared/schema/store.schema';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class FoodService {
  constructor(
    @Inject(FOOD_SERVICE_NAME) private foodMicroservice: ClientProxy,
  ) {}

  getFoodWithElastic(filter: FoodElasticRequest) {
    return this.foodMicroservice.send(FOOD_PATTERN.ELASTIC_SEARCH_FOOD, filter);
  }

  populateElasticData(isForceUpdate: boolean) {
    return this.foodMicroservice.send(
      FOOD_PATTERN.ELASTIC_POPULATE,
      isForceUpdate,
    );
  }

  getFood(foodFilter: FoodRequest): Observable<Food[]> {
    return this.foodMicroservice.send<Food[], FoodRequest>(
      FOOD_PATTERN.LIST,
      foodFilter,
    );
  }

  getTodayFood(): Observable<TodayFood[]> {
    return this.foodMicroservice.send<TodayFood[]>(FOOD_PATTERN.TODAY_FOOD, '');
  }

  getAllBanner() {
    return this.foodMicroservice.send(FOOD_PATTERN.BANNER_LIST, '');
  }

  getMenuList() {
    return this.foodMicroservice.send(FOOD_PATTERN.MENU_LIST, '');
  }

  getStoreDetail(storeId: number) {
    return this.foodMicroservice.send<StoreAndMenu>(
      FOOD_PATTERN.STORE_DETAIL,
      storeId,
    );
  }
}
