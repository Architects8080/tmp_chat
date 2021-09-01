import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(user: User) {
    let newUser: User = this.userRepository.create(user);

    try {
      return await this.userRepository.insert(newUser);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async getUsers() {
    return this.userRepository.find();
  }

  async getUserById(id: number) {
    const user: User = await this.userRepository.findOne({where : {id : id}});
    if (!user) throw new NotFoundException();
    return user;
  }

  async deleteUserById(id: number) {
    await this.userRepository.delete({ id: id });
  }
}
