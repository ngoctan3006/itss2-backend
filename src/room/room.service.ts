import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Role, Room, RoomImage } from '@prisma/client';
import { IResponse } from 'src/common/dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { getKeyByFilename } from 'src/utils';
import { UploadService } from './../upload/upload.service';
import { UserService } from './../user/user.service';
import { CreateRoomDto, FilterRoomDto, UpdateRoomDto } from './dto';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);
  private readonly maxWait = 10000;
  private readonly timeout = 60000;
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
    private readonly userService: UserService,
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
    const owner = await this.userService.findOneById(owner_id);
    if (owner.role !== Role.OWNER) {
      throw new BadRequestException({
        success: false,
        message: 'User is not owner',
        data: null,
      });
    }
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
            owner,
            room_attribute,
            room_image,
          };
        },
        {
          maxWait: this.maxWait,
          timeout: this.timeout,
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

  getCondition({
    name,
    address,
    type,
    area_from,
    area_to,
    distance_to_school_from,
    distance_to_school_to,
    price_from,
    price_to,
    electronic_price_from,
    electronic_price_to,
    water_price_from,
    water_price_to,
    wifi_internet,
    air_conditioner,
    water_heater,
    refrigerator,
    washing_machine,
    enclosed_toilet,
    safed_device,
  }: FilterRoomDto) {
    const condition = {};
    if (name) {
      condition['name'] = {
        contains: name,
        mode: 'insensitive',
      };
    }
    if (address) {
      condition['address'] = {
        contains: address,
        mode: 'insensitive',
      };
    }
    if (type) {
      condition['type'] = type;
    }
    if (area_from) {
      condition['area'] = {
        gte: area_from,
      };
    }
    if (area_to) {
      condition['area'] = {
        ...condition?.['area'],
        lte: area_to,
      };
    }
    if (distance_to_school_from) {
      condition['distance_to_school'] = {
        gte: distance_to_school_from,
      };
    }
    if (distance_to_school_to) {
      condition['distance_to_school'] = {
        ...condition?.['distance_to_school'],
        lte: distance_to_school_to,
      };
    }
    if (price_from) {
      condition['price'] = {
        gte: price_from,
      };
    }
    if (price_to) {
      condition['price'] = {
        ...condition?.['price'],
        lte: price_to,
      };
    }
    if (electronic_price_from) {
      condition['room_attribute'] = {
        electronic_price: {
          gte: electronic_price_from,
        },
      };
    }
    if (electronic_price_to) {
      condition['room_attribute'] = {
        ...condition?.['room_attribute'],
        electronic_price: {
          ...condition?.['room_attribute']?.['electronic_price'],
          lte: electronic_price_to,
        },
      };
    }
    if (water_price_from) {
      condition['room_attribute'] = {
        ...condition?.['room_attribute'],
        water_price: {
          gte: water_price_from,
        },
      };
    }
    if (water_price_to) {
      condition['room_attribute'] = {
        ...condition?.['room_attribute'],
        water_price: {
          ...condition?.['room_attribute']?.['water_price'],
          lte: water_price_to,
        },
      };
    }
    if (wifi_internet) {
      condition['room_attribute'] = {
        ...condition?.['room_attribute'],
        wifi_internet,
      };
    }
    if (air_conditioner) {
      condition['room_attribute'] = {
        ...condition?.['room_attribute'],
        air_conditioner,
      };
    }
    if (water_heater) {
      condition['room_attribute'] = {
        ...condition?.['room_attribute'],
        water_heater,
      };
    }
    if (refrigerator) {
      condition['room_attribute'] = {
        ...condition?.['room_attribute'],
        refrigerator,
      };
    }
    if (washing_machine) {
      condition['room_attribute'] = {
        ...condition?.['room_attribute'],
        washing_machine,
      };
    }
    if (enclosed_toilet) {
      condition['room_attribute'] = {
        ...condition?.['room_attribute'],
        enclosed_toilet,
      };
    }
    if (safed_device) {
      condition['room_attribute'] = {
        ...condition?.['room_attribute'],
        safed_device,
      };
    }
    return condition;
  }

  async findAll(params: FilterRoomDto): Promise<IResponse<Room[]>> {
    const { page, page_size, order_direction } = params;
    const where = this.getCondition(params);

    return {
      success: true,
      message: 'Get rooms successfully',
      data: await this.prisma.room.findMany({
        where,
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
        total: await this.prisma.room.count({ where }),
      },
    };
  }

  async getRoomByOwner(
    owner_id: number,
    params: FilterRoomDto,
  ): Promise<IResponse<Room[]>> {
    const { page, page_size, order_direction } = params;
    const where = {
      owner_id,
      ...this.getCondition(params),
    };

    return {
      success: true,
      message: 'Get rooms successfully',
      data: await this.prisma.room.findMany({
        where,
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
        total: await this.prisma.room.count({ where }),
      },
    };
  }

  async findOneByRoomId(
    id: number,
  ): Promise<Room & { room_image: RoomImage[] }> {
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

  async update(
    id: number,
    data: UpdateRoomDto,
    images: Express.Multer.File[],
  ): Promise<Room> {
    const oldRoom = await this.findOneByRoomId(id);
    const {
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
      const newRoom = await this.prisma.$transaction(
        async (prisma) => {
          const room = await prisma.room.update({
            where: { id },
            data: { name, address, type, area, distance_to_school, price },
          });
          const room_attribute = await prisma.roomAttribute.update({
            where: { room_id: room.id },
            data: {
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
            const newRoomImage = await prisma.roomImage.create({
              data: {
                room_id: room.id,
                image_url: url,
              },
            });
            room_image.push(newRoomImage);
          }

          for (const image of oldRoom.room_image) {
            await this.uploadService.deleteFileS3(image.image_url);
            this.logger.log(`Deleted ${image.image_url}`);
            await this.prisma.roomImage.delete({
              where: { id: image.id },
            });
          }
          return {
            ...room,
            room_attribute,
            room_image,
          };
        },
        {
          maxWait: this.maxWait,
          timeout: this.timeout,
        },
      );

      return newRoom;
    } catch (error) {
      this.logger.error(error?.message || 'Update room failed');
      for (const url of uploadedUrls) {
        await this.uploadService.deleteFileS3(url);
        this.logger.log(`Deleted ${url}`);
      }
      throw new BadRequestException({
        success: false,
        message: error?.message || 'Update room failed',
        data: null,
      });
    }
  }

  async delete(id: number): Promise<null> {
    const roomToDelete = await this.findOneByRoomId(id);
    try {
      await this.prisma.$transaction(
        async (prisma) => {
          await prisma.room.delete({
            where: { id },
          });
          for (const image of roomToDelete.room_image) {
            await this.uploadService.deleteFileS3(image.image_url);
            this.logger.log(`Deleted ${image.image_url}`);
          }
        },
        {
          maxWait: this.maxWait,
          timeout: this.timeout,
        },
      );
      return null;
    } catch (error) {
      this.logger.error(error?.message || 'Delete room failed');
      throw new BadRequestException({
        success: false,
        message: error?.message || 'Delete room failed',
        data: null,
      });
    }
  }
}
