import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Room, RoomImage } from '@prisma/client';
import { IQuery, IResponse } from 'src/common/dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { getKeyByFilename } from 'src/utils';
import { UploadService } from './../upload/upload.service';
import { CreateRoomDto } from './dto';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

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
    const uploadedUrls: string[] = [];
    try {
      const room = await this.prisma.$transaction(
        async (prisma) => {
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
            const key = `room/${room.id}/${getKeyByFilename(
              image.originalname,
            )}`;
            const { url } = await this.uploadService.uploadFile(image, key);
            this.logger.log(`Uploaded ${url}`);
            uploadedUrls.push(url);
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
        },
        {
          maxWait: 10000,
          timeout: 60000,
        },
      );

      return room;
    } catch (error) {
      this.logger.error(error?.message || 'Create room failed');
      for (const url of uploadedUrls) {
        await this.uploadService.deleteFileS3(url);
        this.logger.log(`Deleted ${url}`);
      }
      throw new BadRequestException({
        success: false,
        message: error?.message || 'Create room failed',
        data: null,
      });
    }
  }

  async findAll(params: IQuery): Promise<IResponse<Room[]>> {
    const { page, page_size, search, order_direction } = params;

    return {
      success: true,
      message: 'Get rooms successfully',
      data: await this.prisma.room.findMany({
        where: {
          address: {
            contains: search,
            mode: 'insensitive',
          },
        },
        skip: (page - 1) * page_size,
        take: page_size,
        orderBy: {
          updated_at: order_direction,
        },
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              avatar: true,
              role: true,
            },
          },
          room_attribute: true,
          room_image: true,
        },
      }),
      pagination: {
        page,
        page_size,
        total: await this.prisma.room.count({
          where: {
            address: {
              contains: search,
              mode: 'insensitive',
            },
          },
        }),
      },
    };
  }

  async getRoomByOwner(
    owner_id: number,
    params: IQuery,
  ): Promise<IResponse<Room[]>> {
    const { page, page_size, search, order_direction } = params;
    return {
      success: true,
      message: 'Get rooms successfully',
      data: await this.prisma.room.findMany({
        where: {
          owner_id,
          address: {
            contains: search,
            mode: 'insensitive',
          },
        },
        skip: (page - 1) * page_size,
        take: page_size,
        orderBy: {
          updated_at: order_direction,
        },
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              avatar: true,
              role: true,
            },
          },
          room_attribute: true,
          room_image: true,
        },
      }),
      pagination: {
        page,
        page_size,
        total: await this.prisma.room.count({
          where: {
            owner_id,
            address: {
              contains: search,
              mode: 'insensitive',
            },
          },
        }),
      },
    };
  }

  async findOneByRoomId(id: number): Promise<Room> {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            avatar: true,
            role: true,
          },
        },
        room_attribute: true,
        room_image: true,
      },
    });
    if (!room) {
      throw new NotFoundException({
        success: false,
        message: 'Room not found',
        data: null,
      });
    }
    return room;
  }
}
