import { Injectable } from '@nestjs/common';
import { Order } from 'src/orders/order.dto';

@Injectable()
export class PaymentsService {

    async processPayment(order: Order, pin: number): Promise<string> {

        // await Call payment processing

        const mockResult = Math.random();

        const result = (mockResult > 0.7) ? 'DECLINED' : 'CONFIRMED';

        const status = (result === 'CONFIRMED' ? 'CONFIRMED' : 'DECLINED');

        return status;
    }

}
