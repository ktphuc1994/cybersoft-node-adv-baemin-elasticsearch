import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { MICROSERVICE_URL } from './constants/microservice.const';

@Injectable()
export class SharedService {
  constructor(private readonly configService: ConfigService) {}

  getRmqOptions(queueKey: string): RmqOptions {
    const RABBITMQ_URL = this.configService.get(MICROSERVICE_URL);
    const QUEUE = this.configService.get(queueKey);

    return {
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URL],
        queue: QUEUE,
        queueOptions: {
          durable: false,
        },
      },
    };
  }
}
