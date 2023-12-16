import { OmitType } from '@nestjs/swagger';
import { ReviewRoomDto } from '.';

export class UpdateReviewDto extends OmitType(ReviewRoomDto, [
  'room_id',
  'user_id',
] as const) {}
