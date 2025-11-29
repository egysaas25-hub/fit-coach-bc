import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersResolver } from './customers.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
    imports: [PrismaModule, UsersModule, SubscriptionsModule],
    providers: [CustomersResolver, CustomersService],
    exports: [CustomersService],
})
export class CustomersModule { }
