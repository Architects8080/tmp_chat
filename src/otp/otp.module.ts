import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/user/entity/user.entity';
import { OTPController } from './otp.controller';
import { OTPService } from './otp.service';
import { OTPStrategy } from './strategy/otp.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [OTPController],
  providers: [OTPService, OTPStrategy],
})
export class OTPModule {}
