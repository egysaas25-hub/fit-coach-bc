import { InputType, Field, Float } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

@InputType()
export class CreateExerciseInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    tenantId: string;

    @Field(() => GraphQLJSON)
    @IsNotEmpty()
    name: any;

    @Field(() => GraphQLJSON, { nullable: true })
    @IsOptional()
    description?: any;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    muscleGroupId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    trainingTypeId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    equipmentNeeded?: string;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    caloriesBurnedPerMin?: number;
}
