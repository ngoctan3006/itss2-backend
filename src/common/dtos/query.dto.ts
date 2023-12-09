import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { transformToInteger } from 'src/utils';

enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class IQuery {
  @ApiProperty({ description: 'Page number', default: 1, required: false })
  @Transform(transformToInteger)
  @IsOptional()
  @IsInt()
  page: number = 1;

  @ApiProperty({ description: 'Page size', default: 10, required: false })
  @Transform(transformToInteger)
  @IsOptional()
  @IsInt()
  page_size: number = 10;

  @ApiProperty({ description: 'Search keyword', default: '', required: false })
  @IsOptional()
  @IsString()
  search: string = '';

  @ApiProperty({
    description: 'Order by updated_at direction',
    enum: OrderDirection,
    default: OrderDirection.DESC,
    required: false,
  })
  @IsOptional()
  @IsString()
  order_direction: OrderDirection = OrderDirection.DESC;
}
