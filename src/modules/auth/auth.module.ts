import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthSharedModule } from './auth-shared.module';
import { UserSharedModule } from '../user/user-shared.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthSharedModule, UserSharedModule,
    JwtModule.register({
    secret: process.env.SECRET_KEY,
    signOptions: { expiresIn: '30d' },
  }),
],
  controllers: [AuthController],
})
export class AuthModule {}
