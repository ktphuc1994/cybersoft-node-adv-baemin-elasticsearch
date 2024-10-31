import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import { PrismaModule } from '@app/shared/prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { MicroserviceHttpExceptionFilter } from '@app/shared/exceptions/microservice-http-exceptions.filter';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    SharedModule,
    PrismaModule,
  ],
  controllers: [CartController],
  providers: [
    CartService,
    { provide: APP_FILTER, useClass: MicroserviceHttpExceptionFilter },
  ],
})
export class CartModule {}
