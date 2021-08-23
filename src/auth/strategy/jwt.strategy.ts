import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as cookie from 'cookie';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtDto } from '../dto/jwt.dto';

var cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  } else if (req && req.request) {
    token = cookie.parse(req.request.headers.cookie)['access_token'];
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
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
      throw new ForbiddenException();
    }
  }
}
