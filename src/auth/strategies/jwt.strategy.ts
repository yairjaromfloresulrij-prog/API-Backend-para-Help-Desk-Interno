import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly ConfigService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ConfigService.get<string>('JWT_SECRET')!,
    });
  }

  validate(payload: {
    sub: number;
    email: string;
    role: string;
  }) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}