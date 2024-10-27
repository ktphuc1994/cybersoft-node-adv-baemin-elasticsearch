import { FOOD_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { FOOD_SERVICE_NAME } from '@app/shared/constants/microservice.const';
import { Food, FoodRequest, TodayFood } from '@app/shared/schema/food.schema';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class FoodService {
  constructor(
    @Inject(FOOD_SERVICE_NAME) private foodMicroservice: ClientProxy,
  ) {}

  getFood(foodFilter: FoodRequest): Observable<Food[]> {
    return this.foodMicroservice.send<Food[], FoodRequest>(
      FOOD_PATTERN.LIST,
      foodFilter,
    );
  }

  getTodayFood(): Observable<TodayFood[]> {
    return this.foodMicroservice.send<TodayFood[]>(FOOD_PATTERN.TODAY_FOOD, '');
  }
}
