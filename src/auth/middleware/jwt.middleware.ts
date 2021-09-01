import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const testUserId = req.cookies['testUserId'];

    try {
      const exist = await this.userService.getUserById(testUserId);
      if (exist) {
        const testUserToken = await this.authService.sign(exist);
        req.cookies['access_token'] = testUserToken;
      }
    } catch (error) {}

    const token = req.cookies['access_token'];
    try {
      const decoded = await this.jwtService.verify(token.access_token, {
        secret: this.configService.get<string>('jwt.secret'),
      });
      const leftExpiredTime = decoded.exp - Date.now() / 1000;
      if (leftExpiredTime < 3600) {
        const newToken = await this.authService.sign({ id: decoded.id });
        res.cookie('access_token', newToken);
      }
    } catch (error) {}
    next();
  }
}
