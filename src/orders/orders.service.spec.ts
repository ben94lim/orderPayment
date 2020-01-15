import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Repository } from 'typeorm';
import { Orders } from './orders.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentsModule } from '../payments/payments.module';

describe('OrdersService', () => {
    let service: OrdersService;
    let repo: Repository<Orders>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            OrdersService,
            {
                provide: getRepositoryToken(Orders),
                useClass: Repository,
            },
        ],
        imports: [PaymentsModule],
        }).compile();

        service = module.get<OrdersService>(OrdersService);
        repo = module.get<Repository<Orders>>(getRepositoryToken(Orders));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('Return array of Orders objects', async () => {
            const testOrder: Orders =  {
                id: 1,
                amount: 10.00,
                status: 'CONFIRMED',
                created: new Date(),
            };

            jest.spyOn(repo, 'find').mockResolvedValueOnce([testOrder]);
            expect(await service.findAll()).toEqual([testOrder]);
        });
    });

    describe('findOne', () => {
        it('Return one Order object', async () => {
            const testOrder: Orders =  {
                id: 1,
                amount: 10.00,
                status: 'CONFIRMED',
                created: new Date(),
            };

            jest.spyOn(repo, 'findOne').mockResolvedValueOnce(testOrder);
            expect(await service.findOne(1)).toEqual(testOrder);
        });
    });

    describe('create', () => {
        it('Return new order object', async () => {
            const testOrder: Orders =  {
                id: 1,
                amount: 10.00,
                status: 'CREATED',
                created: new Date(),
            };

            jest.spyOn(repo, 'save').mockResolvedValueOnce(testOrder);
            expect(await service.create(10, 123456)).toEqual(`Successfully created Order Id ${testOrder.id}`);
        });
    });

    describe('updateStatus', () => {
        it('Return true if record exists and successfully updated', async () => {
            const testOrder: Orders =  {
                id: 1,
                amount: 10.00,
                status: 'CONFIRMED',
                created: new Date(),
            };
            const cancelTestOrder: Orders =  {
                id: 1,
                amount: 10.00,
                status: 'CANCELLED',
                created: new Date(),
            };

            jest.spyOn(repo, 'findOne').mockResolvedValueOnce(testOrder);
            jest.spyOn(repo, 'save').mockResolvedValueOnce(cancelTestOrder);
            expect(await service.cancel(1)).toEqual(`Order ID ${testOrder.id} cancelled`);
        });
    });

    describe('cancel', () => {
        it('Change order status to cancelled', async () => {
            const testOrder: Orders =  {
                id: 1,
                amount: 10.00,
                status: 'CONFIRMED',
                created: new Date(),
            };

            const cancelTestOrder: Orders =  {
                id: 1,
                amount: 10.00,
                status: 'CANCELLED',
                created: new Date(),
            };

            jest.spyOn(repo, 'findOne').mockResolvedValueOnce(testOrder);
            jest.spyOn(repo, 'save').mockResolvedValueOnce(cancelTestOrder);
            expect(await service.findOne(1)).toEqual(testOrder);
        });
    });
});
