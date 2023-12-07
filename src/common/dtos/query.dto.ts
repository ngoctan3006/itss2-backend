import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class IQuery {
  @ApiProperty({ description: 'Page number', default: 1, required: false })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  page: number = 1;

  @ApiProperty({ description: 'Page size', default: 10, required: false })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  page_size: number = 10;

  @ApiProperty({ description: 'Search keyword', default: '', required: false })
  @IsOptional()
  @IsString()
  search: string = '';
}