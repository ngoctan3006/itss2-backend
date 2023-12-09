import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Room } from '@prisma/client';
import { IQuery, IResponse } from 'src/common/dtos';
import { CreateRoomDto } from './dto';
import { RoomService } from './room.service';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  @Post()
  async create(
    @Body() data: CreateRoomDto,
    @UploadedFiles(
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
    images: Express.Multer.File[],
  ): Promise<IResponse<Room>> {
    return {
      success: true,
      message: 'Create room successfully',
      data: await this.roomService.create(data, images),
    };
  }

  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by address',
  })
  @Get()
  async findAll(@Query() params: IQuery): Promise<IResponse<Room[]>> {
    return await this.roomService.findAll(params);
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: 'Room id',
  })
  @Get(':id')
  async findOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<Room>> {
    return {
      success: true,
      message: 'Get room successfully',
      data: await this.roomService.findOneByRoomId(id),
    };
  }

  @ApiParam({
    name: 'owner_id',
    required: true,
    description: 'Room owner id',
  })
  @Get('owner/:owner_id')
  async getRoomByOwner(
    @Param('owner_id', ParseIntPipe) owner_id: number,
    @Query() params: IQuery,
  ): Promise<IResponse<Room[]>> {
    return await this.roomService.getRoomByOwner(owner_id, params);
  }
}
