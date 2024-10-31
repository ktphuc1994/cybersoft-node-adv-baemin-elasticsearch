import { NestFactory } from '@nestjs/core';
import { SharedService } from '@app/shared';
import { FoodModule } from './food.module';
import { FOOD_QUEUE } from '@app/shared/constants/microservice.const';

async function bootstrap() {
  const app = await NestFactory.create(FoodModule);
  const sharedService = app.get(SharedService);

  app.connectMicroservice(sharedService.getRmqOptions(FOOD_QUEUE), {
    inheritAppConfig: true,
  });
  app.startAllMicroservices();
}
bootstrap();
