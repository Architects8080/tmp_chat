import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
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
