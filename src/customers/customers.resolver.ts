import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { CustomerFilterInput } from './dto/customer-filter.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Customer)
@UseGuards(JwtAuthGuard)
export class CustomersResolver {
    constructor(private readonly customersService: CustomersService) { }

    @Query(() => [Customer], { name: 'customers' })
    async findAll(@Args('filter', { nullable: true }) filter?: CustomerFilterInput): Promise<Customer[]> {
        const where = filter?.search
            ? {
                OR: [
                    { first_name: { contains: filter.search, mode: 'insensitive' as const } },
                    { last_name: { contains: filter.search, mode: 'insensitive' as const } },
                    { phone_e164: { contains: filter.search } },
                ],
                ...(filter.status && { status: filter.status as any }),
            }
            : filter?.status
                ? { status: filter.status as any }
                : {};

        return this.customersService.findAll({
            skip: filter?.skip,
            take: filter?.take,
            where,
        });
    }

    @Query(() => Customer, { name: 'customer', nullable: true })
    async findOne(@Args('id') id: string): Promise<Customer | null> {
        return this.customersService.findOne(id);
    }

    @Mutation(() => Customer)
    async createCustomer(@Args('input') input: CreateCustomerInput): Promise<Customer> {
        return this.customersService.create(input);
    }

    @Mutation(() => Customer)
    async updateCustomer(
        @Args('id') id: string,
        @Args('input') input: UpdateCustomerInput,
    ): Promise<Customer> {
        return this.customersService.update(id, input);
    }

    @Mutation(() => Customer)
    async deleteCustomer(@Args('id') id: string): Promise<Customer> {
        return this.customersService.remove(id);
    }
}
