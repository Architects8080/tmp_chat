import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  createAvatarUrl(filename: string): string {
    if (!filename.match('^https?://')) {
      const route = this.configService.get<string>('public.route');
      const avatarRoute = this.configService.get<string>('public.avatar.route');
      return `http://localhost:5000${route}${avatarRoute}/${filename}`;
    }
    return filename;
  }

  async createUser(user: User) {
    let newUser: User = this.userRepository.create(user);

    try {
      return await this.userRepository.insert(newUser);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getUsers() {
    return (await this.userRepository.find()).map(({ otpSecret, ...user }) => {
      user.avatar = this.createAvatarUrl(user.avatar);
      return user;
    });
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException();
    user.avatar = this.createAvatarUrl(user.avatar);
    return user;
  }

  async deleteUserById(id: number) {
    await this.userRepository.delete({ id: id });
  }

  async updateAvatar(user: User, file: Express.Multer.File) {
    await this.userRepository.update(user.id, { avatar: file.filename });
  }
}
