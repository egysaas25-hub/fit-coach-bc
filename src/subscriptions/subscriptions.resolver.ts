import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionInput, UpdateSubscriptionInput } from './dto/subscription.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Subscription)
@UseGuards(JwtAuthGuard)
export class SubscriptionsResolver {
    constructor(private readonly subscriptionsService: SubscriptionsService) { }

    @Query(() => [Subscription], { name: 'subscriptions' })
    findAll(
        @Args('tenantId', { type: () => String, nullable: true }) tenantId?: string,
        @Args('customerId', { type: () => String, nullable: true }) customerId?: string,
    ) {
        const where: any = {};

        if (tenantId) {
            where.tenant_id = BigInt(tenantId);
        }

        if (customerId) {
            where.customer_id = BigInt(customerId);
        }

        return this.subscriptionsService.findAll({ where });
    }

    @Query(() => Subscription, { name: 'subscription', nullable: true })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.subscriptionsService.findOne(id);
    }

    @Mutation(() => Subscription)
    createSubscription(@Args('input') input: CreateSubscriptionInput) {
        return this.subscriptionsService.create(input);
    }

    @Mutation(() => Subscription)
    updateSubscription(@Args('input') input: UpdateSubscriptionInput) {
        return this.subscriptionsService.update(input);
    }

    @Mutation(() => Subscription)
    cancelSubscription(@Args('id', { type: () => String }) id: string) {
        return this.subscriptionsService.cancel(id);
    }
}
