import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { transformToInteger } from 'src/utils';

export class ReviewRoomDto {
  @ApiProperty({ description: 'User id' })
  @Transform(transformToInteger)
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @ApiProperty({ description: 'Room id' })
  @Transform(transformToInteger)
  @IsNotEmpty()
  @IsInt()
  room_id: number;

  @ApiProperty({ description: 'Review content' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Star rating' })
  @Transform(transformToInteger)
  @IsNotEmpty()
  @IsInt()
  star: number;

  @ApiProperty({ type: 'string', format: 'binary', isArray: true })
  images: Express.Multer.File[];
}
