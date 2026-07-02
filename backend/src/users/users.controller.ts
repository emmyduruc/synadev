import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiStandardResponses } from '../common/decorators/api-standard-responses.decorator';
import { SWAGGER_TAGS } from '../swagger/swagger.constants';

import { CreateUserDto, UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags(SWAGGER_TAGS.users)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a user',
    description:
      'Registers a new user with email and display name. ' +
      'Email must be unique and name must be between 1 and 100 characters.',
  })
  @ApiCreatedResponse({
    description: 'User successfully created',
    type: UserDto,
  })
  @ApiStandardResponses({ conflict: true })
  create(@Body() dto: CreateUserDto): UserDto {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all users',
    description: 'Returns every registered user ordered by creation time.',
  })
  @ApiOkResponse({
    description: 'Array of user records',
    type: UserDto,
    isArray: true,
  })
  findAll(): UserDto[] {
    return this.usersService.findAll();
  }
}
