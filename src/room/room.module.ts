import { Module } from '@nestjs/common';
import { UploadModule } from 'src/upload/upload.module';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [UploadModule],
  providers: [RoomService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
