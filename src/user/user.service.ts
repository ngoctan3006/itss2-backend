import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { IQuery, IResponse } from 'src/common/dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async findOneById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'User not found',
        data: null,
      });
    }
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'User not found',
        data: null,
      });
    }
    return user;
  }

  async findAll(
    params: IQuery,
  ): Promise<IResponse<Array<Omit<User, 'password'>>>> {
    const { page, page_size, order_direction } = params;
    return {
      success: true,
      message: 'Get all users successfully',
      data: await this.prisma.user.findMany({
        skip: page_size * (page - 1),
        take: page_size,
        orderBy: {
          updated_at: order_direction,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
          role: true,
          created_at: true,
          updated_at: true,
        },
      }),
      pagination: {
        page,
        page_size,
        total: await this.prisma.user.count(),
      },
    };
  }

  async create(data: CreateUserDto) {}
}
