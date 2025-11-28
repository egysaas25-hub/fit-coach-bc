import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateWorkoutExerciseInput } from './create-workout-exercise.input';

@InputType()
export class CreateWorkoutInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    tenantId: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    customerId: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    split?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    notes?: string;

    @Field({ defaultValue: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @Field(() => [CreateWorkoutExerciseInput], { nullable: true })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateWorkoutExerciseInput)
    exercises?: CreateWorkoutExerciseInput[];
}
