import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IQuery, IResponse } from 'src/common/dtos';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query() params: IQuery,
  ): Promise<IResponse<Array<Omit<User, 'password'>>>> {
    return await this.userService.findAll(params);
  }
}
