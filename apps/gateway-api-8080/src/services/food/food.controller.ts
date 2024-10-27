import { Controller, Get, Query } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodRequest } from '@app/shared/schema/food.schema';

@Controller('food')
export class FoodController {
  constructor(private foodService: FoodService) {}

  @Get()
  getFood(@Query() foodFilter: FoodRequest) {
    return this.foodService.getFood(foodFilter);
  }

  @Get('today')
  getTodayFood() {
    return this.foodService.getTodayFood();
  }
}
