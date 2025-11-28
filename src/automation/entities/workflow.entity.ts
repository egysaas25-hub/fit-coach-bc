import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class Workflow {
    @Field(() => ID)
    id: string;

    @Field()
    tenantId: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    trigger: string;

    @Field(() => String)
    actions: string; // JSON string

    @Field({ nullable: true })
    category?: string;

    @Field()
    isActive: boolean;

    @Field(() => Int)
    executions: number;

    @Field(() => Float)
    successRate: number;

    @Field({ nullable: true })
    lastRunAt?: Date;

    @Field()
    createdBy: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
