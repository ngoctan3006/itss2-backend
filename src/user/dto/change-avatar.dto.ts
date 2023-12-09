import { ApiProperty } from '@nestjs/swagger';

export class ChangeAvatarDto {
  @ApiProperty({
    description: 'New image avatar',
    type: 'string',
    format: 'binary',
  })
  image: any;
}
