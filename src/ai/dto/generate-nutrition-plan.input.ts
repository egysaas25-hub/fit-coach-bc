import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsInt, IsArray, Min } from 'class-validator';

@InputType()
export class GenerateNutritionPlanInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    tenantId: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    customerId: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(1000)
    caloriesTarget?: number;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    dietaryRestrictions?: string[];

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    goalType?: string;

    @Field(() => Int, { nullable: true, defaultValue: 3 })
    @IsOptional()
    @IsInt()
    @Min(1)
    mealsPerDay?: number;
}
