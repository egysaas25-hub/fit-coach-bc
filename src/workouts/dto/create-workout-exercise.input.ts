import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

@InputType()
export class CreateWorkoutExerciseInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    exerciseId: string;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    sets: number;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    reps: number;

    @Field(() => Int)
    @IsInt()
    @Min(0)
    orderIndex: number;
}
