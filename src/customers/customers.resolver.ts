import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { CustomerFilterInput } from './dto/customer-filter.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { UsersLoader } from '../users/users.loader';

@Resolver(() => Customer)
@UseGuards(JwtAuthGuard)
export class CustomersResolver {
    constructor(
        private readonly customersService: CustomersService,
        private readonly usersLoader: UsersLoader,
    ) { }

    @Query(() => [Customer], { name: 'customers' })
    findAll(@Args('filter', { nullable: true }) filter?: CustomerFilterInput) {
        const where: any = {};
        if (filter?.search) {
            where.OR = [
                { first_name: { contains: filter.search, mode: 'insensitive' } },
                { last_name: { contains: filter.search, mode: 'insensitive' } },
                { phone_e164: { contains: filter.search } },
            ];
        }
        if (filter?.status) {
            where.status = filter.status;
        }

        return this.customersService.findAll({
            skip: filter?.skip,
            take: filter?.take,
            where,
        });
    }

    @Query(() => Customer, { name: 'customer' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.customersService.findOne(id);
    }

    @Mutation(() => Customer)
    createCustomer(@Args('input') input: CreateCustomerInput) {
        return this.customersService.create(input);
    }

    @Mutation(() => Customer)
    updateCustomer(@Args('input') input: UpdateCustomerInput) {
        return this.customersService.update(input.id, input);
    }

    @Mutation(() => Customer)
    deleteCustomer(@Args('id', { type: () => String }) id: string) {
        return this.customersService.remove(id);
    }

    @ResolveField(() => User, { nullable: true })
    async trainer(@Parent() customer: Customer) {
        if (!customer.trainerId) return null;
        return this.usersLoader.batchUsers.load(customer.trainerId);
    }
}
