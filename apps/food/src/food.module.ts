import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import { PrismaModule } from '@app/shared/prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { MicroserviceHttpExceptionFilter } from '@app/shared/exceptions/microservice-http-exceptions.filter';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    SharedModule,
    PrismaModule,
  ],
  controllers: [FoodController],
  providers: [
    FoodService,
    { provide: APP_FILTER, useClass: MicroserviceHttpExceptionFilter },
  ],
})
export class FoodModule {}
