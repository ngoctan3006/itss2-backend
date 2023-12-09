import { Module } from '@nestjs/common';
import { UploadModule } from 'src/upload/upload.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UploadModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
