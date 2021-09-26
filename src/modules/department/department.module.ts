import { Module } from '@nestjs/common';
import { AuthSharedModule } from '../auth/auth-shared.module';
import { DepartmentSharedModule } from './department-shared.module';
import { DepartmentController } from './department.controller';

@Module({
    controllers: [DepartmentController],
  imports: [DepartmentSharedModule, AuthSharedModule]
})
export class DepartmentModule {}
