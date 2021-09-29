import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as cookie from 'cookie';
import { Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { JwtDto } from 'src/auth/dto/jwt.dto';

export const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  } else if (req && req.request) {
    token = cookie.parse(req.request.headers.cookie)['access_token'];
  }
  return token;
};

@Injectable()
export class OTPStrategy extends PassportStrategy(Strategy, 'otp') {
  constructor(config: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.secret'),
    });
  }
  async validate(payload: JwtDto) {
    try {
      return this.authService.validate(payload);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
