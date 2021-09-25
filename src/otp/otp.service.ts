import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { authenticator } from 'otplib';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OTPService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private generateSecret(): string {
    return authenticator.generateSecret();
  }

  private checkTOTP(token: string, secret: string): boolean {
    return authenticator.check(token, secret);
  }

  async register(user: User): Promise<string> {
    if (user.otpSecret) throw new ConflictException();

    const secret = this.generateSecret();
    user.otpSecret = secret;
    await this.userRepository.save(user);
    return secret;
  }

  async deregister(user: User) {
    user.otpSecret = null;
    try {
      await this.userRepository.update(user.id, { otpSecret: null });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  login(user: User, token: string): boolean {
    if (user.otpSecret == null) return true;
    return this.checkTOTP(token, user.otpSecret);
  }
}
