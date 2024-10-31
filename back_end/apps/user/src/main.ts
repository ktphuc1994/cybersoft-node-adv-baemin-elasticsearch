import { NestFactory } from '@nestjs/core';
import { SharedService } from '@app/shared';
import { USER_QUEUE } from '@app/shared/constants/microservice.const';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const sharedService = app.get(SharedService);

  app.connectMicroservice(sharedService.getRmqOptions(USER_QUEUE), {
    inheritAppConfig: true,
  });
  app.startAllMicroservices();
}
bootstrap();
