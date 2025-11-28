import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CustomersService } from './customers.service';
import { CustomersResolver } from './customers.resolver';

@Module({
    imports: [PrismaModule],
    providers: [CustomersService, CustomersResolver],
    exports: [CustomersService],
})
export class CustomersModule { }
