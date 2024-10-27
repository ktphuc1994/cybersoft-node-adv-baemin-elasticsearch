import { Controller, UsePipes } from '@nestjs/common';
import { FoodService } from './food.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FOOD_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { ZodValidationPipe } from '@app/shared/pipes/zodValidation.pipe';
import {
  CheckStockRequest,
  checkStockRequestSchema,
  Food,
  FoodRequest,
  foodRequestSchema,
  TodayFood,
} from '@app/shared/schema/food.schema';
import { EnhancedParseIntPipe } from '@app/shared/pipes/parse-int.pipe';

@Controller()
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @MessagePattern(FOOD_PATTERN.LIST)
  @UsePipes(new ZodValidationPipe(foodRequestSchema))
  getFood(@Payload() foodFilter: FoodRequest): Promise<Food[]> {
    return this.foodService.getFood(foodFilter);
  }

  @MessagePattern(FOOD_PATTERN.TODAY_FOOD)
  getTodayFood(): Promise<TodayFood[]> {
    return this.foodService.getTodayFood();
  }

  @MessagePattern(FOOD_PATTERN.GET_BY_ID)
  getFoodDetail(@Payload(EnhancedParseIntPipe) foodId: number) {
    return this.foodService.getFoodDetail(foodId);
  }

  @MessagePattern(FOOD_PATTERN.CHECK_STOCK)
  @UsePipes(new ZodValidationPipe(checkStockRequestSchema))
  checkStock(@Payload() requestInfo: CheckStockRequest[]) {
    return this.foodService.checkStock(requestInfo);
  }
}
