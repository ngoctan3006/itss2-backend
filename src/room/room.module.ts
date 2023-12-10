import { Module } from '@nestjs/common';
import { UploadModule } from 'src/upload/upload.module';
import { UserModule } from 'src/user/user.module';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [UploadModule, UserModule],
  providers: [RoomService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
