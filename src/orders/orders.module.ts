import { Module } from '@nestjs/common';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PaymentsModule } from 'src/payments/payments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orders]), PaymentsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService, TypeOrmModule],
})
export class OrdersModule {}
