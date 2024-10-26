import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GUARD_KEY } from '../constants/jwt.const';

@Injectable()
export class JwtGuard extends AuthGuard(GUARD_KEY.JWT) {}
