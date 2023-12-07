import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Room } from '@prisma/client';
import { IQuery, IResponse } from 'src/common/dtos';
import { CreateRoomDto } from './dto';
import { RoomService } from './room.service';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @Post()
  async create(@Body() data: CreateRoomDto): Promise<IResponse<Room>> {
    return {
      success: true,
      message: 'Create room successfully',
      data: await this.roomService.create(data),
    };
  }

  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by address',
  })
  @Get()
  async findAll(@Query() params: IQuery): Promise<IResponse<Room[]>> {
    return {
      success: true,
      message: 'Get rooms successfully',
      data: await this.roomService.findAll(params),
      pagination: await this.roomService.getPagination(params, 'address'),
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<Room>> {
    return {
      success: true,
      message: 'Get room successfully',
      data: await this.roomService.findOne(id),
    };
  }
}
