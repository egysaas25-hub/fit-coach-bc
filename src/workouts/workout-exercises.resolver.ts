import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { WorkoutExercise } from './entities/workout-exercise.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { ExercisesLoader } from '../exercises/exercises.loader';

@Resolver(() => WorkoutExercise)
export class WorkoutExercisesResolver {
    constructor(private readonly exercisesLoader: ExercisesLoader) { }

    @ResolveField(() => Exercise)
    async exercise(@Parent() workoutExercise: WorkoutExercise): Promise<Exercise> {
        return this.exercisesLoader.batchExercises.load(workoutExercise.exerciseId);
    }
}
