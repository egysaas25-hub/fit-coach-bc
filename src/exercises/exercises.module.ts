import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesResolver } from './exercises.resolver';

@Module({
    providers: [ExercisesResolver, ExercisesService],
    exports: [ExercisesService],
})
export class ExercisesModule { }
