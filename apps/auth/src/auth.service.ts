import { PrismaService } from '@app/shared/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateUserRequest,
  LoginRequest,
  User,
} from '../../../libs/shared/src/schema/user.schema';
import * as bcrypt from 'bcrypt';
import {
  AccessToken,
  AccessTokenPayload,
} from '../../../libs/shared/src/types/auth.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginInfo: LoginRequest): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: { email: loginInfo.email },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    const isMatch: boolean = bcrypt.compareSync(
      loginInfo.password,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Email hoặc password không đúng');
    }
    return user;
  }

  async login(user: User): Promise<AccessToken> {
    const payload: AccessTokenPayload = {
      email: user.email,
      user_id: user.user_id,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(user: CreateUserRequest): Promise<AccessToken> {
    const existingUser = await this.prismaService.user.findFirst({
      where: { email: user.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: CreateUserRequest = { ...user, password: hashedPassword };
    const createdUser = await this.prismaService.user.create({ data: newUser });
    return this.login(createdUser);
  }
}
