import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import {
  AUTH_QUEUE,
  AUTH_SERVICE_NAME,
  CART_QUEUE,
  CART_SERVICE_NAME,
  FOOD_QUEUE,
  FOOD_SERVICE_NAME,
  USER_QUEUE,
  USER_SERVICE_NAME,
} from '@app/shared/constants/microservice.const';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './services/auth/auth.controller';
import { APP_FILTER } from '@nestjs/core';
import { GatewayGlobalExceptionsFilter } from './exceptions/global-exception.filter';
import { GatewayHttpExceptionsFilter } from './exceptions/http-exception.filter';
import { UserService } from './services/user/user.service';
import { UserController } from './services/user/user.controller';
import { FoodController } from './services/food/food.controller';
import { FoodService } from './services/food/food.service';
import { CartController } from './services/cart/cart.controller';
import { CartService } from './services/cart/cart.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    SharedModule.registerRmq(AUTH_SERVICE_NAME, AUTH_QUEUE),
    SharedModule.registerRmq(USER_SERVICE_NAME, USER_QUEUE),
    SharedModule.registerRmq(FOOD_SERVICE_NAME, FOOD_QUEUE),
    SharedModule.registerRmq(CART_SERVICE_NAME, CART_QUEUE),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    FoodController,
    CartController,
  ],
  providers: [
    AppService,
    AuthService,
    UserService,
    FoodService,
    CartService,
    { provide: APP_FILTER, useClass: GatewayGlobalExceptionsFilter },
    { provide: APP_FILTER, useClass: GatewayHttpExceptionsFilter },
  ],
})
export class AppModule {}
