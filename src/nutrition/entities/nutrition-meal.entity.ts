import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { NutritionMealItem } from './nutrition-meal-item.entity';

@ObjectType()
export class NutritionMeal {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    planId: string;

    @Field()
    mealName: string;

    @Field(() => Int)
    orderIndex: number;

    @Field({ nullable: true })
    notes?: string;

    @Field(() => [NutritionMealItem], { nullable: true })
    items?: NutritionMealItem[];
}
