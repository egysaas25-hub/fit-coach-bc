import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateNutritionMealItemInput } from './create-nutrition-meal-item.input';

@InputType()
export class CreateNutritionMealInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    mealName: string;

    @Field(() => Int)
    @IsInt()
    @Min(0)
    orderIndex: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    notes?: string;

    @Field(() => [CreateNutritionMealItemInput], { nullable: true })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateNutritionMealItemInput)
    items?: CreateNutritionMealItemInput[];
}
