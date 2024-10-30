import { Controller, Get, Param, Query } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodRequest } from '@app/shared/schema/food.schema';
import { StoreAndMenu } from '@app/shared/schema/store.schema';

@Controller()
export class FoodController {
  constructor(private foodService: FoodService) {}

  @Get('food')
  getFood(@Query() foodFilter: FoodRequest) {
    return this.foodService.getFood(foodFilter);
  }

  @Get('food/today')
  getTodayFood() {
    return this.foodService.getTodayFood();
  }

  @Get('banner')
  getAllBanner() {
    return this.foodService.getAllBanner();
  }

  @Get('menu')
  getMenuList() {
    return this.foodService.getMenuList();
  }

  @Get('store/:storeId')
  getStoreDetail(@Param('storeId') storeId: number) {
    return this.foodService.getStoreDetail(storeId);
  }
}
