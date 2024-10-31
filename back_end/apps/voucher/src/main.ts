import { NestFactory } from '@nestjs/core';
import { VoucherModule } from './voucher.module';
import { SharedService } from '@app/shared';
import { VOUCHER_QUEUE } from '@app/shared/constants/microservice.const';

async function bootstrap() {
  const app = await NestFactory.create(VoucherModule);
  const sharedService = app.get(SharedService);

  app.connectMicroservice(sharedService.getRmqOptions(VOUCHER_QUEUE), {
    inheritAppConfig: true,
  });
  app.startAllMicroservices();
}
bootstrap();
