import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
    imports: [
        OrdersModule,
        PaymentsModule,
        TypeOrmModule.forRoot(),
        ScheduleModule.forRoot(),
    ],
    controllers: [AppController, OrdersController],
    providers: [AppService, OrdersService],
})
export class AppModule {
    constructor(private readonly connection: Connection) {}
}
