import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import {
  AUTH_QUEUE,
  AUTH_SERVICE_NAME,
} from '@app/shared/constants/microservice.const';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    SharedModule.registerRmq(AUTH_SERVICE_NAME, AUTH_QUEUE),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
