import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import {
  transformToIntegerOrUndefined,
  transformToValueOrUndefined,
} from 'src/utils';

export class UpdateReviewDto {
  @ApiProperty({ description: 'Review content', required: false })
  @Transform(transformToValueOrUndefined)
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Star rating', required: false })
  @Transform(transformToIntegerOrUndefined)
  @IsOptional()
  star: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  images: Express.Multer.File[];
}
