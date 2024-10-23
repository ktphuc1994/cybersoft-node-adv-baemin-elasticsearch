import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SharedService } from './shared.service';
import { MICROSERVICE_URL } from './constants/microservice.const';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' })],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {
  static registerRmq(serviceName: string, queueKey: string): DynamicModule {
    return {
      module: SharedModule,
      providers: [
        {
          provide: serviceName,
          useFactory: (configService: ConfigService) => {
            const RABBITMQ_URL = configService.get(MICROSERVICE_URL);
            const QUEUE = configService.get(queueKey);

            return ClientProxyFactory.create({
              transport: Transport.RMQ,
              options: {
                urls: [RABBITMQ_URL],
                queue: QUEUE,
                queueOptions: {
                  durable: false,
                },
              },
            });
          },
          inject: [ConfigService],
        },
      ],
      exports: [serviceName],
    };
  }
}
