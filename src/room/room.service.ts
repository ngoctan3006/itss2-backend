import { Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';
import { IPagination, IQuery } from 'src/common/dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async getPagination(params: IQuery, field: keyof Room): Promise<IPagination> {
    const { page, page_size, search } = params;
    const total = await this.prisma.room.count({
      where: {
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });
    return {
      page,
      page_size,
      total,
    };
  }

  async create(data: CreateRoomDto): Promise<Room> {
    return this.prisma.room.create({ data });
  }

  async findAll(params: IQuery): Promise<Room[]> {
    const { page, page_size, search } = params;
    return this.prisma.room.findMany({
      where: {
        address: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip: (page - 1) * page_size,
      take: page_size,
    });
  }
}
