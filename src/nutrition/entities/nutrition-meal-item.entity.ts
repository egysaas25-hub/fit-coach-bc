import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { NutritionFood } from './nutrition-food.entity';

@ObjectType()
export class NutritionMealItem {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    mealId: string;

    @Field()
    foodName: string;

    @Field(() => ID, { nullable: true })
    foodId?: string;

    @Field({ nullable: true })
    portionSize?: string;

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

    @Field(() => GraphQLJSON, { nullable: true })
    alternatives?: any;

    @Field(() => Int)
    orderIndex: number;

    @Field(() => NutritionFood, { nullable: true })
    food?: NutritionFood;
}
