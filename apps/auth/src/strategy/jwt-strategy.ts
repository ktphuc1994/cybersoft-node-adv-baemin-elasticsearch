import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtRequest } from '../types/jwt';
import { GUARD_KEY, JWT_SECRET } from '../constants/jwt.const';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, GUARD_KEY.JWT) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: JwtRequest) => request.jwt,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get(JWT_SECRET),
    });
  }

  async validate(payload: any) {
    return { ...payload };
  }
}
