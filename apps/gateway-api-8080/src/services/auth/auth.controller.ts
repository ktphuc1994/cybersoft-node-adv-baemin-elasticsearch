import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserRequest,
  LoginRequest,
} from '@app/shared/schema/user.schema';
import { AccessToken } from '@app/shared/types/auth.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() newUser: CreateUserRequest) {
    return this.authService.register(newUser);
  }

  @Post('login')
  async login(@Body() loginInfo: LoginRequest) {
    return this.authService.login(loginInfo);
  }
}
