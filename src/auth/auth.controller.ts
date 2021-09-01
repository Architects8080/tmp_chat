import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { User } from 'src/user/entity/user.entity';
import { AuthService } from './auth.service';
import { FTAuthGuard } from './guard/ft-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async test(@Req() req, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.sign(req.user);
    if (token) {
      res.cookie('access_token', token);
      return res.redirect(
        `${this.configService.get<string>('client_address')}/main`,
      );
    }
  }

  @UseGuards(FTAuthGuard)
  @Get('login')
  async login(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Session() session: Record<string, User>,
  ) {
    const token = await this.authService.login(req.user, session);
    if (token) {
      res.cookie('access_token', token);
      return res.redirect(
        `${this.configService.get<string>('client_address')}/main`,
      );
    }
    return res.redirect(
      `${this.configService.get<string>('client_address')}/register`,
    );
  }

  @Post('register')
  async register(
    @Body('nickname') nickname: string,
    @Res({ passthrough: true }) res: Response,
    @Session() session: any,
  ) {
    if (!session.newUser) throw new ForbiddenException();
    const token = await this.authService.register(nickname, session);
    res.cookie('access_token', token);
    session.destroy();
    return true;
  }
}
