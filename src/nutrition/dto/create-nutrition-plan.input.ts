import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateNutritionMealInput } from './create-nutrition-meal.input';

@InputType()
export class CreateNutritionPlanInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    tenantId: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    customerId: string;

    @Field({ defaultValue: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    caloriesTarget?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    notes?: string;

    @Field({ defaultValue: 'approved' })
    @IsOptional()
    @IsString()
    status?: string;

    @Field(() => [CreateNutritionMealInput], { nullable: true })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateNutritionMealInput)
    meals?: CreateNutritionMealInput[];
}
