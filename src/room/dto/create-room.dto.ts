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
import {
  transformToInteger,
  transformToNumber,
  transfromToBoolean,
} from 'src/utils';

export class CreateRoomDto {
  @ApiProperty({ description: 'Room owner id' })
  @Transform(transformToInteger)
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
  @Transform(transformToNumber)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  area: number;

  @ApiProperty({ description: 'Distance to school in km' })
  @Transform(transformToNumber)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  distance_to_school: number;

  @ApiProperty({ description: 'Room price in VND' })
  @Transform(transformToNumber)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Price of electricity in VND' })
  @Transform(transformToNumber)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  electronic_price: number;

  @ApiProperty({ description: 'Price of water in VND' })
  @Transform(transformToNumber)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  water_price: number;

  @ApiProperty({ description: 'Room description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Has wifi? Default: false',
    type: Boolean,
    default: false,
    required: false,
  })
  @Transform(transfromToBoolean)
  @IsOptional()
  @IsBoolean()
  wifi_internet: boolean;

  @ApiProperty({
    description: 'Has air conditioner? Default: false',
    type: Boolean,
    default: false,
    required: false,
  })
  @Transform(transfromToBoolean)
  @IsOptional()
  @IsBoolean()
  air_conditioner: boolean;

  @ApiProperty({
    description: 'Has water heater? Default: false',
    type: Boolean,
    default: false,
    required: false,
  })
  @Transform(transfromToBoolean)
  @IsOptional()
  @IsBoolean()
  water_heater: boolean;

  @ApiProperty({
    description: 'Has refrigerator? Default: false',
    type: Boolean,
    default: false,
    required: false,
  })
  @Transform(transfromToBoolean)
  @IsOptional()
  @IsBoolean()
  refrigerator: boolean;

  @ApiProperty({
    description: 'Has washing machine? Default: false',
    type: Boolean,
    default: false,
    required: false,
  })
  @Transform(transfromToBoolean)
  @IsOptional()
  @IsBoolean()
  washing_machine: boolean;

  @ApiProperty({
    description: 'Has enclosed toilet? Default: false',
    type: Boolean,
    default: false,
    required: false,
  })
  @Transform(transfromToBoolean)
  @IsOptional()
  @IsBoolean()
  enclosed_toilet: boolean;

  @ApiProperty({
    description: 'Has safed device? Default: false',
    type: Boolean,
    default: false,
    required: false,
  })
  @Transform(transfromToBoolean)
  @IsOptional()
  @IsBoolean()
  safed_device: boolean;

  @ApiProperty({ type: 'string', format: 'binary', isArray: true })
  images: Express.Multer.File[];
}
