import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @Post()
  async creatUser(@Body() req, @Body('nickname')  nickname: string) {
    // req -> req.user로 변경이 필요
    return this.userService.createUser(req, nickname);
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUserById(id);
  }
}
