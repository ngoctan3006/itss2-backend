import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Unique username' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'Password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: 'User role', enum: Role, default: Role.USER })
  @IsNotEmpty()
  @IsString()
  role: Role;
}
