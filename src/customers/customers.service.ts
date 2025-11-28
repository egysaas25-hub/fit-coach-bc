import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateCustomerInput): Promise<Customer> {
        const customer = await this.prisma.customers.create({
            data: {
                tenant_id: BigInt(data.tenantId),
                phone_e164: data.phone || '',
                first_name: data.name.split(' ')[0],
                last_name: data.name.split(' ').slice(1).join(' ') || undefined,
                status: (data.status as any) || 'lead',
                source: 'landing',
                region: 'MENA',
            },
        });
        return this.mapToCustomer(customer);
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.customersWhereInput;
    }): Promise<Customer[]> {
        const customers = await this.prisma.customers.findMany({
            skip: params.skip,
            take: params.take,
            where: params.where,
        });
        return customers.map((c) => this.mapToCustomer(c));
    }

    async findOne(id: string): Promise<Customer | null> {
        const customer = await this.prisma.customers.findUnique({
            where: { id: BigInt(id) },
        });
        return customer ? this.mapToCustomer(customer) : null;
    }

    async update(id: string, data: UpdateCustomerInput): Promise<Customer> {
        const updateData: Prisma.customersUpdateInput = {};
        if (data.name) {
            updateData.first_name = data.name.split(' ')[0];
            updateData.last_name = data.name.split(' ').slice(1).join(' ') || undefined;
        }
        if (data.phone) updateData.phone_e164 = data.phone;
        if (data.status) updateData.status = data.status as any;

        const customer = await this.prisma.customers.update({
            where: { id: BigInt(id) },
            data: updateData,
        });
        return this.mapToCustomer(customer);
    }

    async remove(id: string): Promise<Customer> {
        const customer = await this.prisma.customers.delete({
            where: { id: BigInt(id) },
        });
        return this.mapToCustomer(customer);
    }

    private mapToCustomer(customer: any): Customer {
        const fullName = [customer.first_name, customer.last_name]
            .filter(Boolean)
            .join(' ');
        return {
            id: customer.id.toString(),
            tenantId: customer.tenant_id.toString(),
            name: fullName || 'Unknown',
            email: customer.phone_e164,
            phone: customer.phone_e164,
            status: customer.status,
            createdAt: customer.created_at,
            updatedAt: customer.updated_at,
        } as Customer;
    }
}
