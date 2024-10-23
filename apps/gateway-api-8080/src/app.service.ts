import { AUTH_PATTERN } from '@app/shared/constants/micro-auth-pattern.const';
import { AUTH_SERVICE_NAME } from '@app/shared/constants/microservice.const';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly authService: ClientProxy,
  ) {}

  getHello() {
    return this.authService.send(AUTH_PATTERN.HELLO, '');
  }
}
