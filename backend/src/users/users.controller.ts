import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateUserDto, UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto): UserDto {
    return this.usersService.create(dto);
  }

  @Get()
  findAll(): UserDto[] {
    return this.usersService.findAll();
  }
}
