import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class Exercise {
    @Field(() => ID)
    id: string;

    @Field()
    tenantId: string;

    @Field(() => GraphQLJSON)
    name: any;

    @Field(() => GraphQLJSON, { nullable: true })
    description?: any;

    @Field({ nullable: true })
    muscleGroupId?: string;

    @Field({ nullable: true })
    trainingTypeId?: string;

    @Field({ nullable: true })
    equipmentNeeded?: string;

    @Field(() => Float, { nullable: true })
    caloriesBurnedPerMin?: number;

    @Field()
    createdAt: Date;
}
