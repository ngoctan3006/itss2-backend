import { ApiProperty } from '@nestjs/swagger';
import { RoomType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

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

  @ApiProperty({ description: 'Price of electricity in VND' })
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  electronic_price: number;

  @ApiProperty({ description: 'Price of water in VND' })
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  water_price: number;

  @ApiProperty({ description: 'Room description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    type: Boolean,
    default: false,
    required: false,
    description: 'Has wifi?',
  })
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  @IsBoolean()
  wifi_internet: boolean;

  @ApiProperty({
    type: Boolean,
    default: false,
    required: false,
    description: 'Has air conditioner?',
  })
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  @IsBoolean()
  air_conditioner: boolean;

  @ApiProperty({
    type: Boolean,
    default: false,
    required: false,
    description: 'Has water heater?',
  })
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  @IsBoolean()
  water_heater: boolean;

  @ApiProperty({
    type: Boolean,
    default: false,
    required: false,
    description: 'Has refrigerator?',
  })
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  @IsBoolean()
  refrigerator: boolean;

  @ApiProperty({
    type: Boolean,
    default: false,
    required: false,
    description: 'Has washing machine?',
  })
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  @IsBoolean()
  washing_machine: boolean;

  @ApiProperty({
    type: Boolean,
    default: false,
    required: false,
    description: 'Has enclosed toilet?',
  })
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  @IsBoolean()
  enclosed_toilet: boolean;

  @ApiProperty({
    type: Boolean,
    default: false,
    required: false,
    description: 'Has safed device?',
  })
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  @IsBoolean()
  safed_device: boolean;
}
