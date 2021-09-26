import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfirmEmail } from './confirm-email.emtity';
import { UserSharedModule } from '../user/user-shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '30d' },
    }),
    TypeOrmModule.forFeature([ConfirmEmail]),
    UserSharedModule
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthSharedModule {}
