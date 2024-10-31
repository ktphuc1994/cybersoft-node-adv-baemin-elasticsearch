import { PrismaService } from '@app/shared/prisma/prisma.service';
import {
  OrderDetailRequest,
  orderStatusSchema,
  PlaceOrderRequest,
} from '@app/shared/schema/order.schema';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  placeOrder({
    foodList,
    discountPercentage,
    service_fee_percentage,
    ...createOrderInfo
  }: PlaceOrderRequest) {
    // tính total_discount
    let total_discount = 0;
    let service_fee = 0;
    const orderFoodData = foodList.map((foodInfo) => {
      const total = foodInfo.price * foodInfo.quantity;
      total_discount += total * discountPercentage;
      service_fee += (total * service_fee_percentage) / 100;

      return {
        food_id: foodInfo.food_id,
        quantity: foodInfo.quantity,
        price_at_time_of_order: foodInfo.price,
      };
    });

    return this.prismaService.order.create({
      data: {
        ...createOrderInfo,
        status: orderStatusSchema.enum.PENDING,
        total_discount: Math.round(total_discount),
        service_fee: Math.round(service_fee),
        order_food: {
          createMany: { data: orderFoodData },
        },
      },
    });
  }

  async getOrderDetail({ order_id, user_id }: OrderDetailRequest) {
    const orderInfo = await this.prismaService.order.findFirst({
      where: { order_id, user_id },
      select: {
        status: true,
        payment_method: true,
        shipping_price: true,
        service_fee: true,
        total_discount: true,
        user: { select: { first_name: true, last_name: true, phone: true } },
        address: { select: { full_address: true } },
        store: { select: { name: true } },
        order_food: {
          select: {
            price_at_time_of_order: true,
            quantity: true,
            food: { select: { image: true, name: true, description: true } },
          },
        },
      },
    });

    if (!orderInfo) throw new BadRequestException('Đơn hàng không tồn tại');

    const food = orderInfo.order_food.map((foodInfo) => ({
      ...foodInfo.food,
      quantity: foodInfo.quantity,
      price: foodInfo.price_at_time_of_order,
    }));

    return {
      status: orderInfo.status,
      payment_method: orderInfo.payment_method,
      shipping_price: orderInfo.shipping_price,
      service_fee: orderInfo.service_fee,
      total_discount: orderInfo.total_discount,
      user: orderInfo.user,
      address: orderInfo.address.full_address,
      store_name: orderInfo.store.name,
      food,
    };
  }
}
