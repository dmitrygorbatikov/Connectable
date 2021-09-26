import { Module } from '@nestjs/common';
import { AuthSharedModule } from '../auth/auth-shared.module';
import { UserSharedModule } from '../user/user-shared.module';
import { OrderSharedModule } from './order-shared.module';
import { OrderController } from './order.controller';

@Module({
  controllers: [OrderController],
  imports: [OrderSharedModule, AuthSharedModule, UserSharedModule]
})
export class OrderModule {}
