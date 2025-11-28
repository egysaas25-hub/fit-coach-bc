import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

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

    trainerId?: string; // Internal field for DataLoader
}
