import {
  CART_PATTERN,
  FOOD_PATTERN,
  ORDER_PATTERN,
  USER_PATTERN,
  VOUCHER_PATTERN,
} from '@app/shared/constants/microservice-pattern.const';
import {
  CART_SERVICE_NAME,
  FOOD_SERVICE_NAME,
  ORDER_SERVICE_NAME,
  USER_SERVICE_NAME,
  VOUCHER_SERVICE_NAME,
} from '@app/shared/constants/microservice.const';
import { CartFood, ValidateCartRequest } from '@app/shared/schema/cart.schema';
import {
  CheckStockRequest,
  CheckStockResponse,
  ValidateFoodInStoreRequest,
} from '@app/shared/schema/food.schema';
import {
  CreateOrderRequest,
  GetOrderInfoQuery,
  OrderInfoResponse,
} from '@app/shared/schema/order.schema';
import {
  StoreAndFee,
  StoreAndShippingPartnerFromMicro,
} from '@app/shared/schema/store.schema';
import { Address } from '@app/shared/schema/user.schema';
import { Voucher } from '@app/shared/schema/voucher.schema';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_SERVICE_NAME) private orderMicroservice: ClientProxy,
    @Inject(USER_SERVICE_NAME) private userMicroservice: ClientProxy,
    @Inject(FOOD_SERVICE_NAME) private foodMicroservice: ClientProxy,
    @Inject(CART_SERVICE_NAME) private cartMicroservice: ClientProxy,
    @Inject(VOUCHER_SERVICE_NAME) private voucherMicroservice: ClientProxy,
  ) {}

  async getInformationByFoodIds(
    requestInfo: GetOrderInfoQuery,
    user_id: number,
  ): Promise<OrderInfoResponse> {
    // validate food in the store
    const payload = {
      foodIds: requestInfo.foodIds.split(','),
      storeId: requestInfo.storeId,
    };
    const foodAndStoreInfo = await lastValueFrom(
      this.foodMicroservice.send<ValidateFoodInStoreRequest>(
        FOOD_PATTERN.VALIDATE_FOOD_IN_STORE,
        payload,
      ),
    );

    // check food in card
    const cartFoodList = await lastValueFrom(
      this.cartMicroservice.send<CartFood[] | null, ValidateCartRequest>(
        CART_PATTERN.VALIDATE,
        { user_id, foodIds: foodAndStoreInfo.foodIds },
      ),
    );
    if (!cartFoodList)
      throw new BadRequestException('Món ăn không tồn tại trong giỏ hàng.');

    // check stock
    await lastValueFrom(
      this.foodMicroservice.emit<unknown, CheckStockRequest[]>(
        FOOD_PATTERN.CHECK_STOCK,
        cartFoodList,
      ),
    );

    // get store and shipping partner information
    const storeInfo = await lastValueFrom(
      this.foodMicroservice.send<StoreAndShippingPartnerFromMicro, number>(
        FOOD_PATTERN.STORE_AND_SHIPPING_PARTNER,
        foodAndStoreInfo.storeId,
      ),
    );
    if (!storeInfo)
      throw new BadRequestException(
        'Cửa hàng tương ứng với các món ăn không tồn tại.',
      );

    // get voucher list
    const voucherList = await lastValueFrom(
      this.voucherMicroservice.send<Voucher[]>(VOUCHER_PATTERN.LIST, ''),
    );

    return {
      store: { ...storeInfo, service_fee: Number(storeInfo.service_fee) },
      food: cartFoodList,
      voucherList,
    };
  }

  async createOrder(orderInfo: CreateOrderRequest) {
    await lastValueFrom(
      this.orderMicroservice.send(
        ORDER_PATTERN.VALIDATE_CREATE_BODY,
        orderInfo,
      ),
    );

    const { foodIds, ...createOrderInfo } = orderInfo;

    // kiểm address
    const addressInfo = await lastValueFrom(
      this.userMicroservice.send<Address>(USER_PATTERN.VALIDATE_ADDRESS, {
        user_id: orderInfo.user_id,
        address_id: orderInfo.address_id,
      }),
    );

    // kiểm tra voucher
    let discountPercentage = 0;
    if (orderInfo.voucher_id) {
      const voucherInfo = await lastValueFrom(
        this.voucherMicroservice.send<{
          voucher_id: number;
          percentage: string;
        } | null>(VOUCHER_PATTERN.DETAIL, orderInfo.voucher_id),
      );
      if (!voucherInfo) throw new BadRequestException('Voucher không tồn tại.');

      discountPercentage = Number(voucherInfo.percentage) / 100;
    }

    // kiểm tra xem foodIds có trong cart không
    const cartFoods = await lastValueFrom(
      this.cartMicroservice.send<CartFood[] | null>(CART_PATTERN.VALIDATE, {
        foodIds,
        user_id: orderInfo.user_id,
      }),
    );
    if (!cartFoods)
      throw new BadRequestException('Món ăn không tồn tại trong giỏ hàng.');

    // Kiểm tra xem món ăn trong cùng 1 cửa hàng không
    await lastValueFrom(
      this.foodMicroservice.send<ValidateFoodInStoreRequest>(
        FOOD_PATTERN.VALIDATE_FOOD_IN_STORE,
        { storeId: orderInfo.store_id, foodIds },
      ),
    );

    // kiểm tra store and shipping method
    const storeInfo = await lastValueFrom(
      this.foodMicroservice.send<StoreAndFee | null>(
        FOOD_PATTERN.STORE_VALIDATE_SHIPPING_METHOD,
        {
          store_id: orderInfo.store_id,
          method_id: orderInfo.method_id,
        },
      ),
    );
    if (!storeInfo)
      throw new BadRequestException(
        'Phương thức vận chuyển không khả dụng với gian hàng.',
      );

    // kiểm tra stock
    const foodStock = await lastValueFrom(
      this.foodMicroservice.send<CheckStockResponse[]>(
        FOOD_PATTERN.CHECK_STOCK,
        cartFoods,
      ),
    );

    // đặt hàng
    const result = await lastValueFrom(
      this.orderMicroservice.send(ORDER_PATTERN.PLACE_ORDER, {
        ...createOrderInfo,
        shipping_price: storeInfo.shipping_price,
        service_fee_percentage: storeInfo.service_fee,
        foodList: cartFoods,
        discountPercentage,
      }),
    );

    // cập nhật stock
    foodStock.map((stockInfo) =>
      this.foodMicroservice.emit(FOOD_PATTERN.UPDATE, {
        food_id: stockInfo.food_id,
        stock: stockInfo.stock - stockInfo.quantity,
      }),
    );

    // xóa sản phẩm trong giỏ hàng
    this.cartMicroservice.emit(CART_PATTERN.REMOVE_MANY, {
      user_id: orderInfo.user_id,
      foodIds,
    });

    return result;
  }

  getOrderDetail(order_id: number, user_id: number) {
    return this.orderMicroservice.send(ORDER_PATTERN.DETAIL, {
      order_id,
      user_id,
    });
  }
}
