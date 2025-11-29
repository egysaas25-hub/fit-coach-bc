import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsResolver } from './subscriptions.resolver';

@Module({
    providers: [SubscriptionsResolver, SubscriptionsService],
    exports: [SubscriptionsService],
})
export class SubscriptionsModule { }
