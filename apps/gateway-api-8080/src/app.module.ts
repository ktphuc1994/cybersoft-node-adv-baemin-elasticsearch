import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import {
  AUTH_QUEUE,
  AUTH_SERVICE_NAME,
} from '@app/shared/constants/microservice.const';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './services/auth/auth.controller';
import { APP_FILTER } from '@nestjs/core';
import { AllGlobalExceptionsFilter } from './exceptions/global-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    SharedModule.registerRmq(AUTH_SERVICE_NAME, AUTH_QUEUE),
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    { provide: APP_FILTER, useClass: AllGlobalExceptionsFilter },
  ],
})
export class AppModule {}
