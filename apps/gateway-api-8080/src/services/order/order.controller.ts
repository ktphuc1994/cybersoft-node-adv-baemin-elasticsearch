import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppGuard } from '@app/shared/guards/app.guard';
import { OrderService } from './order.service';
import { CurrentUser } from '@app/shared/decorators/current-user.decorator';
import { UserInReq } from '@app/shared/types/shared.type';
import {
  CreateOrderRequest,
  GetOrderInfoQuery,
} from '@app/shared/schema/order.schema';

@UseGuards(AppGuard)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('information-by-food-ids')
  getInformationByFoodIds(
    @CurrentUser() userInfo: UserInReq,
    @Query() requestInfo: GetOrderInfoQuery,
  ) {
    return this.orderService.getInformationByFoodIds(
      requestInfo,
      userInfo.user_id,
    );
  }

  @Post('create')
  createOrder(
    @CurrentUser() userInfo: UserInReq,
    @Body() orderInfo: Omit<CreateOrderRequest, 'user_id'>,
  ) {
    return this.orderService.createOrder({
      ...orderInfo,
      user_id: userInfo.user_id,
    });
  }

  @Get('detail/:orderId')
  getOrderDetail(
    @CurrentUser() userInfo: UserInReq,
    @Param('orderId') orderId: number,
  ) {
    return this.orderService.getOrderDetail(orderId, userInfo.user_id);
  }
}
