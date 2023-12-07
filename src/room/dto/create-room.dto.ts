import { ApiProperty } from '@nestjs/swagger';
import { RoomType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'Owner id' })
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  owner_id: number;

  @ApiProperty({ description: 'Room name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Room address' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Room type',
    enum: RoomType,
    default: RoomType.PHONG_TRO,
  })
  @IsNotEmpty()
  @IsString()
  type: RoomType;

  @ApiProperty({ description: 'Room area in m2' })
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  area: number;

  @ApiProperty({ description: 'Distance to school in km' })
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  distance_to_school: number;

  @ApiProperty({ description: 'Room price in VND' })
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}
