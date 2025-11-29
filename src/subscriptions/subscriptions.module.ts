import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsResolver } from './subscriptions.resolver';

import { SubscriptionsLoader } from './subscriptions.loader';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [SubscriptionsResolver, SubscriptionsService, SubscriptionsLoader],
    exports: [SubscriptionsService, SubscriptionsLoader],
})
export class SubscriptionsModule { }
