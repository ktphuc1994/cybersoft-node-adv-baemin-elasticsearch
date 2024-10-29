import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppGuard } from '@app/shared/guards/app.guard';
import { OrderService } from './order.service';

@UseGuards(AppGuard)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('information-by-food-ids')
  getInformationByFoodIds() {
    return this.orderService.getInformationByFoodIds();
  }
}
