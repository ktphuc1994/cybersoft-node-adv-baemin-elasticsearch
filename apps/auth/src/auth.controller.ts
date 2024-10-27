import { Controller, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { JwtGuard } from './guards/jwt.guard';
import {
  CreateUserRequest,
  createUserRequestSchema,
  LoginRequest,
  loginRequestSchema,
} from '../../../libs/shared/src/schema/user.schema';
import { AccessToken } from '../../../libs/shared/src/types/auth.type';
import { ZodValidationPipe } from '@app/shared/pipes/zodValidation.pipe';
import { RequestWithUser, UserInReq } from '@app/shared/types/shared.type';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERN.REGISTER)
  @UsePipes(new ZodValidationPipe(createUserRequestSchema))
  async register(@Payload() newUser: CreateUserRequest): Promise<AccessToken> {
    return this.authService.register(newUser);
  }

  @MessagePattern(AUTH_PATTERN.LOGIN)
  @UsePipes(new ZodValidationPipe(loginRequestSchema))
  async login(@Payload() loginInfo: LoginRequest): Promise<AccessToken> {
    const userInfo = await this.authService.validateUser(loginInfo);
    return this.authService.login(userInfo);
  }

  @UseGuards(JwtGuard)
  @MessagePattern(AUTH_PATTERN.AUTHEN)
  async authenticate(@Payload() data: RequestWithUser): Promise<UserInReq> {
    return data.user;
  }
}
