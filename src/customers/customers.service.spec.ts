import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerFilterInput } from './dto/customer-filter.input';

describe('CustomersService', () => {
    let service: CustomersService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        customers: {
            findMany: jest.fn().mockResolvedValue([]),
            count: jest.fn().mockResolvedValue(0),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CustomersService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<CustomersService>(CustomersService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should call prisma.customers.findMany with correct parameters for filtering', async () => {
            const filter: CustomerFilterInput = {
                search: 'John',
                status: 'active',
                skip: 0,
                take: 10,
            };

            const where = {
                OR: [
                    { first_name: { contains: 'John', mode: 'insensitive' } },
                    { last_name: { contains: 'John', mode: 'insensitive' } },
                    { phone_e164: { contains: 'John' } },
                ],
                status: 'active',
            };

            // We need to manually construct the where clause as the resolver does
            // But wait, the service just takes the where clause passed to it.
            // The logic for constructing the where clause is in the RESOLVER, not the service.
            // So I should test the RESOLVER, not the service, for this logic.

            // Let's change this test to verify the service passes through the params correctly.
            await service.findAll({ skip: 0, take: 10, where: { status: 'active' } });

            expect(prismaService.customers.findMany).toHaveBeenCalledWith({
                skip: 0,
                take: 10,
                where: { status: 'active' },
            });
        });
    });
});
