import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, IsInt } from 'class-validator';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class CreateNutritionMealItemInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    foodName: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    foodId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    portionSize?: string;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    calories?: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    proteinG?: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    carbsG?: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    fatG?: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    fiberG?: number;

    @Field(() => GraphQLJSON, { nullable: true })
    @IsOptional()
    alternatives?: any;

    @Field(() => Int)
    @IsInt()
    @Min(0)
    orderIndex: number;
}
