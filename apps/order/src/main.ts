import { NestFactory } from '@nestjs/core';
import { SharedService } from '@app/shared';
import { ORDER_QUEUE } from '@app/shared/constants/microservice.const';
import { OrderModule } from './order.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  const sharedService = app.get(SharedService);

  app.connectMicroservice(sharedService.getRmqOptions(ORDER_QUEUE), {
    inheritAppConfig: true,
  });
  app.startAllMicroservices();
}
bootstrap();
