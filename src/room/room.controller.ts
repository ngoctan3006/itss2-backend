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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { Room } from '@prisma/client';
import { IResponse } from 'src/common/dtos';
import { CreateRoomDto, FilterRoomDto, UpdateRoomDto } from './dto';
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

  @Get()
  async findAll(@Query() params: FilterRoomDto): Promise<IResponse<Room[]>> {
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
    @Query() params: FilterRoomDto,
  ): Promise<IResponse<Room[]>> {
    return await this.roomService.getRoomByOwner(owner_id, params);
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: 'Room id to update',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRoomDto,
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
      message: 'Update room successfully',
      data: await this.roomService.update(id, data, images),
    };
  }
}
