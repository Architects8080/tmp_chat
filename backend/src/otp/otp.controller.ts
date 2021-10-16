import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/user/entity/user.entity';
import { OTPAuthGuard } from './guard/otp-auth.guard';
import { OTPService } from './otp.service';

@Controller('otp')
export class OTPController {
  constructor(
    private otpService: OTPService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  @HttpCode(200)
  async register(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.otpService.register(req.user as User);
  }

  @UseGuards(JwtAuthGuard)
  @Post('deregister')
  @HttpCode(200)
  async deregister(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.otpService.deregister(req.user as User);
  }

  @UseGuards(OTPAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(
    @Req() req: Request,
    @Body('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (this.otpService.login(req.user as User, token)) {
      const jwtToken = await this.authService.sign(req.user as User, true);
      res.cookie('access_token', jwtToken);
    } else {
      throw new UnauthorizedException();
    }
  }

  // 강제로 otp 설정을 해제합니다.
  @UseGuards(OTPAuthGuard)
  @Post('force')
  async force(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.otpService.deregister(req.user as User);
    const jwtToken = await this.authService.sign(req.user as User, true);
    res.cookie('access_token', jwtToken);
  }
}
