import { NestFactory } from '@nestjs/core';
import { SharedService } from '@app/shared';
import { CartModule } from './cart.module';
import { CART_QUEUE } from '@app/shared/constants/microservice.const';

async function bootstrap() {
  const app = await NestFactory.create(CartModule);
  const sharedService = app.get(SharedService);

  app.connectMicroservice(sharedService.getRmqOptions(CART_QUEUE), {
    inheritAppConfig: true,
  });
  app.startAllMicroservices();
}
bootstrap();
