import { OmitType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends OmitType(CreateRoomDto, [
  'owner_id',
] as const) {}
