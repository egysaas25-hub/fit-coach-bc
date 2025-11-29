import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CustomersService } from './customers.service';
import { CustomersResolver } from './customers.resolver';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [PrismaModule, UsersModule],
    providers: [CustomersService, CustomersResolver],
    exports: [CustomersService],
})
export class CustomersModule { }
