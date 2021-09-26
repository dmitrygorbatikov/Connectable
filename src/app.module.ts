import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/user/user.entity';
import { OrderModule } from './modules/order/order.module';
import { Order } from './modules/order/order.entity';
import { City } from './modules/city/city.entity';
import { Department } from './modules/department/department.entity';
import { ConfirmEmail } from './modules/auth/confirm-email.emtity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'dmitry',
      password: 'Z18SPXQtELHh',
      database: 'postdb',
      entities: [User, Order, City, Department, ConfirmEmail],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UserModule,
    AuthModule,
    OrderModule,
  ],
})
export class AppModule {}
