import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { AUTH_PATTERN } from '@app/shared/constants/micro-auth-pattern.const';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERN.HELLO)
  getHello() {
    return this.authService.getHello();
  }
}
