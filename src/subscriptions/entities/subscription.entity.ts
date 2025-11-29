import { ObjectType, Field, ID, Int, Float, registerEnumType } from '@nestjs/graphql';

export enum SubscriptionStatus {
    ACTIVE = 'active',
    PAUSED = 'paused',
    CANCELED = 'canceled',
    EXPIRED = 'expired',
}

registerEnumType(SubscriptionStatus, {
    name: 'SubscriptionStatus',
});

@ObjectType()
export class Subscription {
    @Field(() => ID)
    id: string;

    @Field()
    tenantId: string;

    @Field()
    customerId: string;

    @Field()
    planCode: string;

    @Field(() => Int)
    priceCents: number;

    @Field()
    currencyId: string;

    @Field(() => Float, { nullable: true })
    amountUsd?: number;

    @Field(() => Float, { nullable: true })
    fxRate?: number;

    @Field(() => SubscriptionStatus)
    status: SubscriptionStatus;

    @Field()
    startAt: Date;

    @Field({ nullable: true })
    renewAt?: Date;

    @Field({ nullable: true })
    cancelAt?: Date;

    @Field({ nullable: true })
    salesOwnerId?: string;

    @Field({ nullable: true })
    coachOwnerId?: string;

    @Field(() => Int)
    rotationPriority: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
