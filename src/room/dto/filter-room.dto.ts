import { ApiProperty } from '@nestjs/swagger';
import { RoomType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IQuery } from 'src/common/dtos';
import {
  transformToInteger,
  transformToNumber,
  transfromToBoolean,
} from 'src/utils';

export class FilterRoomDto extends IQuery {
  @ApiProperty({ description: 'Room name', required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Room address', required: false })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Room type',
    enum: RoomType,
    required: false,
  })
  @IsOptional()
  @IsString()
  type: RoomType;

  @ApiProperty({ description: 'Room area from', required: false })
  @Transform(transformToNumber)
  @IsOptional()
  @IsNumber()
  area_from: number;

  @ApiProperty({ description: 'Room area to', required: false })
  @Transform(transformToNumber)
  @IsOptional()
  @IsNumber()
  area_to: number;

  @ApiProperty({ description: 'Distance to school from', required: false })
  @Transform(transformToNumber)
  @IsOptional()
  @IsNumber()
  distance_to_school_from: number;

  @ApiProperty({ description: 'Distance to school to', required: false })
  @Transform(transformToNumber)
  @IsOptional()
  @IsNumber()
  distance_to_school_to: number;

  @ApiProperty({ description: 'Room price from', required: false })
  @Transform(transformToInteger)
  @IsOptional()
  @IsInt()
  price_from: number;

  @ApiProperty({ description: 'Room price to', required: false })
  @Transform(transformToInteger)
  @IsOptional()
  @IsInt()
  price_to: number;

  @ApiProperty({ description: 'Electronic price from', required: false })
  @Transform(transformToNumber)
  @IsOptional()
  @IsNumber()
  electronic_price_from: number;

  @ApiProperty({ description: 'Electronic price to', required: false })
  @Transform(transformToNumber)
  @IsOptional()
  @IsNumber()
  electronic_price_to: number;

  @ApiProperty({ description: 'Water price from', required: false })
  @Transform(transformToNumber)
  @IsOptional()
  @IsNumber()
  water_price_from: number;

  @ApiProperty({ description: 'Water price to', required: false })
  @Transform(transformToNumber)
  @IsOptional()
  @IsNumber()
  water_price_to: number;

  @ApiProperty({ description: 'Has wifi? Default: false', required: false })
  @Transform(transfromToBoolean)
  @IsOptional()
  @IsBoolean()
  wifi_internet: boolean;

  @ApiProperty({
    description: 'Has air conditioner? Default: false',
    required: false,
  })
  @Transform(transfromToBoolean)
  @IsOptional()
  @IsBoolean()
  air_conditioner: boolean;

  @ApiProperty({
    description: 'Has water heater? Default: false',
    required: false,
  })
  @Transform(transfromToBoolean)
  @IsOptional()
  @IsBoolean()
  water_heater: boolean;

  @ApiProperty({
    description: 'Has refrigerator? Default: false',
    required: false,
  })
  @Transform(transfromToBoolean)
  @IsOptional()
  @IsBoolean()
  refrigerator: boolean;

  @ApiProperty({
    description: 'Has washing machine? Default: false',
    required: false,
  })
  @Transform(transfromToBoolean)
  @IsOptional()
  @IsBoolean()
  washing_machine: boolean;

  @ApiProperty({
    description: 'Has enclosed toilet? Default: false',
    required: false,
  })
  @Transform(transfromToBoolean)
  @IsOptional()
  @IsBoolean()
  enclosed_toilet: boolean;

  @ApiProperty({
    description: 'Has safed device? Default: false',
    required: false,
  })
  @Transform(transfromToBoolean)
  @IsOptional()
  @IsBoolean()
  safed_device: boolean;
}
