import {
  CART_PATTERN,
  FOOD_PATTERN,
} from '@app/shared/constants/microservice-pattern.const';
import {
  CART_SERVICE_NAME,
  FOOD_SERVICE_NAME,
} from '@app/shared/constants/microservice.const';
import {
  AddCartRequest,
  RemoveCartRequest,
  UpdateCartRequest,
} from '@app/shared/schema/cart.schema';
import { Food } from '@app/shared/schema/food.schema';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CartService {
  constructor(
    @Inject(CART_SERVICE_NAME) private cartMicroservice: ClientProxy,
    @Inject(FOOD_SERVICE_NAME) private foodMicroservice: ClientProxy,
  ) {}

  getCart(userId: number) {
    return this.cartMicroservice.send(CART_PATTERN.LIST, userId);
  }

  getCartTotalItem(userId: number) {
    return this.cartMicroservice.send<number>(CART_PATTERN.TOTAL, userId);
  }

  async addToCart(addCartInfo: Omit<AddCartRequest, 'stock'>) {
    const { stock } = await lastValueFrom(
      this.foodMicroservice.send<Food>(
        FOOD_PATTERN.GET_BY_ID,
        addCartInfo.food_id,
      ),
    );

    return this.cartMicroservice.send<unknown, AddCartRequest>(
      CART_PATTERN.ADD,
      { ...addCartInfo, stock },
    );
  }

  async updateItemInCart(addCartInfo: Omit<UpdateCartRequest, 'stock'>) {
    const { stock } = await lastValueFrom(
      this.foodMicroservice.send<Food>(
        FOOD_PATTERN.GET_BY_ID,
        addCartInfo.food_id,
      ),
    );

    return this.cartMicroservice.send<unknown, UpdateCartRequest>(
      CART_PATTERN.UPDATE,
      { ...addCartInfo, stock },
    );
  }

  async removeCartItem(removeCartInfo: RemoveCartRequest) {
    return this.cartMicroservice.send(CART_PATTERN.REMOVE, removeCartInfo);
  }
}
