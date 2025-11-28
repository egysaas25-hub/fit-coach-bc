import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Exercise } from '../../exercises/entities/exercise.entity';

@ObjectType()
export class WorkoutExercise {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    planId: string;

    @Field(() => ID)
    exerciseId: string;

    @Field(() => Int)
    sets: number;

    @Field(() => Int)
    reps: number;

    @Field(() => Int)
    orderIndex: number;

    @Field(() => Exercise)
    exercise?: Exercise;
}
