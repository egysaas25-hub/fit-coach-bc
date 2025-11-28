import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class NutritionFood {
    @Field(() => ID)
    id: string;

    @Field()
    tenantId: string;

    @Field(() => GraphQLJSON)
    foodName: any;

    @Field()
    portionSize: string;

    @Field(() => Float, { nullable: true })
    calories?: number;

    @Field(() => Float, { nullable: true })
    proteinG?: number;

    @Field(() => Float, { nullable: true })
    carbsG?: number;

    @Field(() => Float, { nullable: true })
    fatG?: number;

    @Field(() => Float, { nullable: true })
    fiberG?: number;

    @Field({ nullable: true })
    category?: string;
}
