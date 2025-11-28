import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { NutritionMeal } from './nutrition-meal.entity';
import { Customer } from '../../customers/entities/customer.entity';

@ObjectType()
export class NutritionPlan {
    @Field(() => ID)
    id: string;

    @Field()
    tenantId: string;

    @Field()
    customerId: string;

    @Field(() => Int)
    version: number;

    @Field()
    isActive: boolean;

    @Field(() => Int, { nullable: true })
    caloriesTarget?: number;

    @Field({ nullable: true })
    notes?: string;

    @Field()
    createdBy: string;

    @Field()
    createdAt: Date;

    @Field()
    status: string;

    @Field(() => [NutritionMeal], { nullable: true })
    meals?: NutritionMeal[];

    @Field(() => Customer, { nullable: true })
    customer?: Customer;
}
