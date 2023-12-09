import { ApiProperty } from '@nestjs/swagger';

export class ChangeAvatarDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
