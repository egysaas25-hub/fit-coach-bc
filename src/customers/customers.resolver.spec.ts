import { Test, TestingModule } from '@nestjs/testing';
import { CustomersResolver } from './customers.resolver';
import { CustomersService } from './customers.service';
import { CustomerFilterInput } from './dto/customer-filter.input';
import { UsersLoader } from '../users/users.loader';

describe('CustomersResolver', () => {
    let resolver: CustomersResolver;
    let service: CustomersService;

    const mockCustomersService = {
        findAll: jest.fn().mockResolvedValue([]),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    const mockUsersLoader = {
        batchUsers: {
            load: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CustomersResolver,
                { provide: CustomersService, useValue: mockCustomersService },
                { provide: UsersLoader, useValue: mockUsersLoader },
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

    it('should resolve trainer using UsersLoader', async () => {
        const customer = { trainerId: '1' } as any;
        const trainer = { id: '1', name: 'Trainer' };

        // Mock loader
        const loadSpy = jest.fn().mockResolvedValue(trainer);
        (resolver as any).usersLoader = { batchUsers: { load: loadSpy } };

        const result = await resolver.trainer(customer);
        expect(loadSpy).toHaveBeenCalledWith('1');
        expect(result).toEqual(trainer);
    });

    it('should return null for trainer if trainerId is missing', async () => {
        const customer = {} as any;
        const result = await resolver.trainer(customer);
        expect(result).toBeNull();
    });
});
