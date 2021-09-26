import { Module } from '@nestjs/common';
import { AuthSharedModule } from '../auth/auth-shared.module';
import { UserSharedModule } from './user-shared.module';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  imports: [UserSharedModule, AuthSharedModule]
})
export class UserModule {}
