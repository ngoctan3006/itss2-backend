import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { IQuery, IResponse } from 'src/common/dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { getKeyByFilename } from 'src/utils';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
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

  async checkUserExist(username: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { username },
    });
    return count > 0;
  }

  async findAll(
    params: IQuery,
    seach: string,
  ): Promise<IResponse<Array<Omit<User, 'password'>>>> {
    const { page, page_size, order_direction } = params;
    return {
      success: true,
      message: 'Get all users successfully',
      data: await this.prisma.user.findMany({
        where: {
          username: {
            contains: seach,
            mode: 'insensitive',
          },
        },
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
        total: await this.prisma.user.count({
          where: {
            username: {
              contains: seach,
              mode: 'insensitive',
            },
          },
        }),
      },
    };
  }

  async create(data: CreateUserDto) {
    const { username, password, role } = data;
    if (await this.checkUserExist(username)) {
      throw new BadRequestException({
        success: false,
        message: 'Username already exists',
        data: null,
      });
    }
    const user = await this.prisma.user.create({
      data: {
        username,
        password,
        role,
      },
    });
    delete user.password;
    return user;
  }

  async changeAvatar(id: number, file: Express.Multer.File): Promise<User> {
    const { username, avatar } = await this.findOneById(id);
    const key = `avatar/${username}/${getKeyByFilename(file.originalname)}`;
    const { url } = await this.uploadService.uploadFile(file, key);
    this.logger.log(`Upload avatar of user ${username} successfully to ${url}`);
    const user = await this.prisma.user.update({
      where: { id },
      data: { avatar: url },
    });
    if (avatar) {
      await this.uploadService.deleteFileS3(avatar);
      this.logger.log(
        `Delete old avatar of user ${username} successfully ${avatar}`,
      );
    }
    return user;
  }
}
