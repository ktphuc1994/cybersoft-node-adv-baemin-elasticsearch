import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import { PrismaModule } from '@app/shared/prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { MicroserviceHttpExceptionFilter } from '@app/shared/exceptions/microservice-http-exceptions.filter';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { StoreController } from './services/store/store.controller';
import { StoreService } from './services/store/store.service';
import { BannerController } from './services/banner/banner.controller';
import { MenuController } from './services/menu/menu.controller';
import { BannerService } from './services/banner/banner.service';
import { MenuService } from './services/menu/menu.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    SharedModule,
    PrismaModule,
  ],
  controllers: [
    FoodController,
    StoreController,
    BannerController,
    MenuController,
  ],
  providers: [
    FoodService,
    StoreService,
    BannerService,
    MenuService,
    { provide: APP_FILTER, useClass: MicroserviceHttpExceptionFilter },
  ],
})
export class FoodModule {}
