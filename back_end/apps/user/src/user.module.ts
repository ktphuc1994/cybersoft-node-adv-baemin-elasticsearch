import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import { PrismaModule } from '@app/shared/prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { MicroserviceHttpExceptionFilter } from '@app/shared/exceptions/microservice-http-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    SharedModule,
    PrismaModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: APP_FILTER, useClass: MicroserviceHttpExceptionFilter },
  ],
})
export class UserModule {}
