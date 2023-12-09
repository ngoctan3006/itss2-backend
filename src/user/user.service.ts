import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
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

  async create(data: CreateUserDto) {}
}
