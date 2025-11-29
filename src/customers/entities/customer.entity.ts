import { Subscription } from '../../subscriptions/entities/subscription.entity';

@ObjectType()
export class Customer {
    @Field(() => ID)
    id: string;

    @Field()
    tenantId: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    status?: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field(() => User, { nullable: true })
    trainer?: User;

    @Field(() => Subscription, { nullable: true })
    subscription?: Subscription;

    trainerId?: string; // Internal field for DataLoader
}
