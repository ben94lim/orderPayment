import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { Order } from './order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {

    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    async createOrder(@Body('amount') amount: number, @Body('pin') pin: number): Promise<string> {
        return this.ordersService.create(amount, pin);
    }

    @Get(':id')
    getOrder(@Param('id') id: number) {
        return this.ordersService.findOne(id);
    }

    @Get()
    async findAll(@Param('limit') limit: Promise<Order[]>) {
        return this.ordersService.findAll();
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() orderObj: Order) {
        return `This action updates order #${id}`;
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return await this.ordersService.cancel(id);
    }
}
