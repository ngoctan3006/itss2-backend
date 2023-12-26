import { ApiProperty } from '@nestjs/swagger';
import { RoomType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  transformToNumberOrUndefined,
  transformToValueOrUndefined,
  transfromToBooleanOrUndefined,
} from 'src/utils';

export class UpdateRoomDto {
  @ApiProperty({ description: 'Room name', required: false })
  @Transform(transformToValueOrUndefined)
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Room address', required: false })
  @Transform(transformToValueOrUndefined)
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Room type',
    enum: RoomType,
    default: RoomType.PHONG_TRO,
    required: false,
  })
  @Transform(transformToValueOrUndefined)
  @IsOptional()
  @IsString()
  type: RoomType;

  @ApiProperty({ description: 'Room area in m2', required: false })
  @Transform(transformToNumberOrUndefined)
  @IsOptional()
  @IsNumber()
  @Min(0)
  area: number;

  @ApiProperty({ description: 'Distance to school in km', required: false })
  @Transform(transformToNumberOrUndefined)
  @IsOptional()
  @IsNumber()
  @Min(0)
  distance_to_school: number;

  @ApiProperty({ description: 'Room price in VND', required: false })
  @Transform(transformToNumberOrUndefined)
  @IsOptional()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Price of electricity in VND', required: false })
  @Transform(transformToNumberOrUndefined)
  @IsOptional()
  @IsNumber()
  @Min(0)
  electronic_price: number;

  @ApiProperty({ description: 'Price of water in VND', required: false })
  @Transform(transformToNumberOrUndefined)
  @IsOptional()
  @IsNumber()
  @Min(0)
  water_price: number;

  @ApiProperty({ description: 'Room description', required: false })
  @Transform(transformToValueOrUndefined)
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Has wifi? Default: false',
    type: Boolean,
    required: false,
  })
  @Transform(transfromToBooleanOrUndefined)
  @IsOptional()
  @IsBoolean()
  wifi_internet: boolean;

  @ApiProperty({
    description: 'Has air conditioner? Default: false',
    type: Boolean,
    required: false,
  })
  @Transform(transfromToBooleanOrUndefined)
  @IsOptional()
  @IsBoolean()
  air_conditioner: boolean;

  @ApiProperty({
    description: 'Has water heater? Default: false',
    type: Boolean,
    required: false,
  })
  @Transform(transfromToBooleanOrUndefined)
  @IsOptional()
  @IsBoolean()
  water_heater: boolean;

  @ApiProperty({
    description: 'Has refrigerator? Default: false',
    type: Boolean,
    required: false,
  })
  @Transform(transfromToBooleanOrUndefined)
  @IsOptional()
  @IsBoolean()
  refrigerator: boolean;

  @ApiProperty({
    description: 'Has washing machine? Default: false',
    type: Boolean,
    required: false,
  })
  @Transform(transfromToBooleanOrUndefined)
  @IsOptional()
  @IsBoolean()
  washing_machine: boolean;

  @ApiProperty({
    description: 'Has enclosed toilet? Default: false',
    type: Boolean,
    required: false,
  })
  @Transform(transfromToBooleanOrUndefined)
  @IsOptional()
  @IsBoolean()
  enclosed_toilet: boolean;

  @ApiProperty({
    description: 'Has safed device? Default: false',
    type: Boolean,
    required: false,
  })
  @Transform(transfromToBooleanOrUndefined)
  @IsOptional()
  @IsBoolean()
  safed_device: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  images: Express.Multer.File[];
}
