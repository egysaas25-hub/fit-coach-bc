import { Test, TestingModule } from '@nestjs/testing';
import { CustomersResolver } from './customers.resolver';
import { CustomersService } from './customers.service';
import { CustomerFilterInput } from './dto/customer-filter.input';

describe('CustomersResolver', () => {
    let resolver: CustomersResolver;
    let service: CustomersService;

    const mockCustomersService = {
        findAll: jest.fn().mockResolvedValue([]),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CustomersResolver,
                { provide: CustomersService, useValue: mockCustomersService },
            ],
        }).compile();

        resolver = module.get<CustomersResolver>(CustomersResolver);
        service = module.get<CustomersService>(CustomersService);
    });

    it('should construct correct where clause for search and status', async () => {
        const filter: CustomerFilterInput = {
            search: 'John',
            status: 'active',
            skip: 0,
            take: 10,
        };

        await resolver.findAll(filter);

        expect(service.findAll).toHaveBeenCalledWith({
            skip: 0,
            take: 10,
            where: {
                OR: [
                    { first_name: { contains: 'John', mode: 'insensitive' } },
                    { last_name: { contains: 'John', mode: 'insensitive' } },
                    { phone_e164: { contains: 'John' } },
                ],
                status: 'active',
            },
        });
    });

    it('should handle empty filter', async () => {
        await resolver.findAll();
        expect(service.findAll).toHaveBeenCalledWith({
            skip: undefined,
            take: undefined,
            where: {},
        });
    });
});
