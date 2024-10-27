import { CART_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { CART_SERVICE_NAME } from '@app/shared/constants/microservice.const';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CartService {
  constructor(
    @Inject(CART_SERVICE_NAME) private cartMicroservice: ClientProxy,
  ) {}

  getCart(userId: number) {
    return this.cartMicroservice.send(CART_PATTERN.LIST, userId);
  }
}
