import { BadRequestException, Injectable } from '@nestjs/common';
import { Room, RoomImage } from '@prisma/client';
import { IPagination, IQuery } from 'src/common/dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from './../upload/upload.service';
import { CreateRoomDto } from './dto';

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

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

  async create(
    data: CreateRoomDto,
    images: Express.Multer.File[],
  ): Promise<Room> {
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
    const room_image: RoomImage[] = [];
    try {
      const room = await this.prisma.$transaction(async (prisma) => {
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
        const room_attribute = await prisma.roomAttribute.create({
          data: {
            room_id: room.id,
            ...attribute,
          },
        });
        for (const image of images) {
          const key = `room/${room.id}/${image.originalname
            .split('.')
            .slice(0, -1)
            .join('.')}_${Date.now()}`;
          const { url } = await this.uploadService.uploadFile(image, key);
          const uploaded = await prisma.roomImage.create({
            data: {
              room_id: room.id,
              image_url: url,
            },
          });
          room_image.push(uploaded);
        }
        return {
          ...room,
          room_attribute,
          room_image,
        };
      });

      return room;
    } catch (error) {
      for (const image of room_image) {
        const key = this.uploadService.getKey(image.image_url);
        await this.uploadService.deleteFileS3(key);
      }
      throw new BadRequestException({
        success: false,
        message: error?.message || 'Create room failed',
        data: null,
      });
    }
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
      include: {
        room_attribute: true,
        room_image: true,
      },
    });
  }

  async findOne(id: number): Promise<Room> {
    return this.prisma.room.findUnique({ where: { id } });
  }
}
