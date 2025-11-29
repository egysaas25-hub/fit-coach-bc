import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { ExercisesService } from './exercises.service';
import { Exercise } from './entities/exercise.entity';

@Injectable({ scope: Scope.REQUEST })
export class ExercisesLoader {
    constructor(private readonly exercisesService: ExercisesService) { }

    public readonly batchExercises = new DataLoader<string, Exercise>(async (ids: string[]) => {
        const exercises = await this.exercisesService.findByIds(ids);
        const exercisesMap = new Map(exercises.map((exercise) => [exercise.id, exercise]));
        return ids.map((id) => exercisesMap.get(id) || new Error(`Exercise not found: ${id}`));
    });
}
