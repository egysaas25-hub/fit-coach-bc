import { Module } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { WorkoutsResolver } from './workouts.resolver';
import { ExercisesModule } from '../exercises/exercises.module';

@Module({
    imports: [ExercisesModule],
    providers: [WorkoutsResolver, WorkoutsService],
    exports: [WorkoutsService],
})
export class WorkoutsModule { }
