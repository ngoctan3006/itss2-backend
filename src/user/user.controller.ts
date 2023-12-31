import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IQuery, IResponse } from 'src/common/dtos';
import { ChangeAvatarDto, CreateUserDto } from './dto';
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

  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'User ID',
  })
  @Get(':id')
  async findOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<User>> {
    const user = await this.userService.findOneById(id);
    delete user.password;
    return {
      success: true,
      message: 'Get user successfully',
      data: user,
    };
  }

  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @Post()
  async create(@Body() data: CreateUserDto): Promise<IResponse<User>> {
    return {
      success: true,
      message: 'Create user successfully',
      data: await this.userService.create(data),
    };
  }

  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'User ID to update',
  })
  @ApiBody({ type: ChangeAvatarDto })
  @UseInterceptors(FileInterceptor('image'))
  @Put('avatar/:id')
  async changeAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image',
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 5, // 5MB
          message: 'Dung lượng file không được vượt quá 5MB',
        })
        .build({
          exceptionFactory: (errors) => {
            throw new BadRequestException({
              success: false,
              message: errors,
              data: null,
            });
          },
        }),
    )
    image: Express.Multer.File,
  ): Promise<IResponse<User>> {
    return {
      success: true,
      message: 'Update user successfully',
      data: await this.userService.changeAvatar(id, image),
    };
  }
}
