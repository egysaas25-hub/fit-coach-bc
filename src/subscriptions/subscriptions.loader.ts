import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './entities/subscription.entity';

@Injectable({ scope: Scope.REQUEST })
export class SubscriptionsLoader {
    constructor(private readonly subscriptionsService: SubscriptionsService) { }

    public readonly batchSubscriptions = new DataLoader<string, Subscription | null>(async (customerIds: string[]) => {
        const subscriptions = await this.subscriptionsService.findByCustomerIds(customerIds);
        const subscriptionsMap = new Map(subscriptions.map((sub) => [sub.customerId, sub]));
        return customerIds.map((id) => subscriptionsMap.get(id) || null);
    });
}
