import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { SharedService } from '@app/shared';
import { AUTH_QUEUE } from '@app/shared/constants/microservice.const';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const sharedService = app.get(SharedService);

  app.connectMicroservice(sharedService.getRmqOptions(AUTH_QUEUE));
  app.startAllMicroservices();
}
bootstrap();
