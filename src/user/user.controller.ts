import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IQuery, IResponse } from 'src/common/dtos';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search user by username',
  })
  @Get()
  async findAll(
    @Query() params: IQuery,
    @Query('search') search: string,
  ): Promise<IResponse<Array<Omit<User, 'password'>>>> {
    return await this.userService.findAll(params, search);
  }
}
