import { BadRequestException, Controller, UsePipes } from '@nestjs/common';
import { FoodService } from './food.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FOOD_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { ZodValidationPipe } from '@app/shared/pipes/zodValidation.pipe';
import {
  CheckStockRequest,
  checkStockRequestSchema,
  Food,
  FoodElasticRequest,
  foodElasticRequestSchema,
  FoodRequest,
  foodRequestSchema,
  TodayFood,
  UpdateFoodRequest,
  updateFoodRequestSchema,
  ValidateFoodInStoreRequest,
  validateFoodInStoreRequestSchema,
} from '@app/shared/schema/food.schema';
import { EnhancedParseIntPipe } from '@app/shared/pipes/parse-int.pipe';

@Controller()
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @MessagePattern(FOOD_PATTERN.ELASTIC_SEARCH_FOOD)
  @UsePipes(new ZodValidationPipe(foodElasticRequestSchema))
  getFoodWithElastic(@Payload() filter: FoodElasticRequest) {
    return this.foodService.getFoodWithElastic(filter);
  }

  @MessagePattern(FOOD_PATTERN.ELASTIC_POPULATE)
  populateElasticData(@Payload() isForceUpdate: boolean) {
    return this.foodService.populateElasticData(isForceUpdate);
  }

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
  getFoodDetail(
    @Payload(new EnhancedParseIntPipe({ fieldName: 'food_id' }))
    food_id: number,
  ) {
    return this.foodService.getFoodDetail(food_id);
  }

  @MessagePattern(FOOD_PATTERN.CHECK_STOCK)
  @UsePipes(new ZodValidationPipe(checkStockRequestSchema.array()))
  checkStock(@Payload() requestInfo: CheckStockRequest[]) {
    return this.foodService.checkStock(requestInfo);
  }

  @MessagePattern(FOOD_PATTERN.VALIDATE_FOOD_IN_STORE)
  @UsePipes(new ZodValidationPipe(validateFoodInStoreRequestSchema))
  validateFoodInStore(@Payload() requestInfo: ValidateFoodInStoreRequest) {
    return this.foodService.validateFoodInStore(requestInfo);
  }

  @MessagePattern(FOOD_PATTERN.UPDATE)
  @UsePipes(new ZodValidationPipe(updateFoodRequestSchema))
  updateFood(@Payload() updateRequest: UpdateFoodRequest) {
    return this.foodService.updateFood(updateRequest);
  }
}
