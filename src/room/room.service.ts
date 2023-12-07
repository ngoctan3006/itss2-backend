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
    const {
      owner_id,
      name,
      address,
      type,
      area,
      distance_to_school,
      price,
      ...attribute
    } = data;
    return this.prisma.$transaction(async (prisma) => {
      const room = await prisma.room.create({
        data: {
          owner_id,
          name,
          address,
          type,
          area,
          distance_to_school,
          price,
        },
      });
      const roomAttribute = await prisma.roomAttribute.create({
        data: {
          room_id: room.id,
          ...attribute,
        },
      });
      delete roomAttribute.id;
      delete roomAttribute.room_id;
      delete roomAttribute.created_at;
      delete roomAttribute.updated_at;
      return {
        ...room,
        ...roomAttribute,
      };
    });
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

  async findOne(id: number): Promise<Room> {
    return this.prisma.room.findUnique({ where: { id } });
  }
}
