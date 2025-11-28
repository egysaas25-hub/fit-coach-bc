import { ObjectType, Field, ID } from '@nestjs/graphql';

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
}
