import { Injectable } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { Order } from './order.dto';
import { Orders } from './orders.entity';
import { PaymentsService } from '../payments/payments.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class OrdersService {

    constructor(
        private paymentsService: PaymentsService,

        @InjectRepository(Orders)
        private readonly orderRepository: Repository<Orders>,
    ) {}

    async create(amount: number, pin: number): Promise<string> {

        const result = await this.orderRepository.save({
            amount,
            status: 'CREATED',
        });

        const newOrderId = result.id;

        this.confirmPayment(newOrderId, pin);

        return `Successfully created Order Id ${newOrderId}`;
    }

    findAll(): Promise<Order[]> {

        return this.orderRepository.find();
    }

    async findOne(orderId: number): Promise<Order> {

        return plainToClass(Order, await this.orderRepository.findOne( { where: { id: orderId} } ));
    }

    async updateStatus(orderId: number, status: string): Promise<boolean> {

        const order = await this.orderRepository.findOne( { where: { id: orderId} } );

        if (order === undefined) {
            return false;
        }

        order.status = status;

        const result = await this.orderRepository.save(order);

        return true;
    }

    async cancel(orderId: number): Promise<string> {

        const result = await this.updateStatus(orderId, 'CANCELLED');

        if (result === false) {
            return `Order ID ${orderId} does not exist`;
        }

        return `Order ID ${orderId} cancelled`;
    }

    async confirmPayment(orderId: number, pin: number) {

        const orderEnt = await this.orderRepository.findOne({ where: { id: orderId} } );
        const order = plainToClass(Order, orderEnt);

        const result = await this.paymentsService.processPayment(order, pin);

        const status = (result === 'CONFIRMED' ? 'CONFIRMED' : 'CANCELLED');

        this.updateStatus(order.id, status);
    }

    @Cron('30 * * * * *')
    deliveredOrders() {
        getConnection()
        .createQueryBuilder()
        .update(Orders)
        .set({
            status: 'DELIVERED',
        })
        .where(`status = 'CONFIRMED' and current_timestamp > DATE_ADD(created, INTERVAL 30 SECOND)`)
        .execute();
    }
}
