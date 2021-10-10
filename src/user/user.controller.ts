import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('search?')
  async getUserByNickname(@Query() query) {
    console.log(query);
    console.log(query.nickname);
    return await this.userService.getUserByNickname(query.nickname);
  }

  @Get()
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Get('me')
  getMe(@Req() req) {
    return req.user;
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('image'))
  async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return await this.userService.updateAvatar(req.user, file);
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserById(id);
  }

  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUserById(id);
  }
}
