import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class ProgressEntry {
    @Field(() => ID)
    id: string;

    @Field()
    tenantId: string;

    @Field()
    customerId: string;

    @Field(() => Float, { nullable: true })
    weightKg?: number;

    @Field({ nullable: true })
    workoutDone?: boolean;

    @Field(() => Float, { nullable: true })
    sleepHours?: number;

    @Field(() => Int, { nullable: true })
    painScore?: number;

    @Field({ nullable: true })
    notes?: string;

    @Field()
    recordedAt: Date;
}
