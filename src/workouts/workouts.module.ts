import { Module } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { WorkoutsResolver } from './workouts.resolver';
import { WorkoutExercisesResolver } from './workout-exercises.resolver';
import { ExercisesModule } from '../exercises/exercises.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule, ExercisesModule],
    providers: [WorkoutsResolver, WorkoutsService, WorkoutExercisesResolver],
    exports: [WorkoutsService],
})
export class WorkoutsModule { }
