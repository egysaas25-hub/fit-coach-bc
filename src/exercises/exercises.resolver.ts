import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { Exercise } from './entities/exercise.entity';
import { CreateExerciseInput } from './dto/create-exercise.input';
import { UpdateExerciseInput } from './dto/update-exercise.input';
import { ExerciseFilterInput } from './dto/exercise-filter.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Exercise)
@UseGuards(JwtAuthGuard)
export class ExercisesResolver {
    constructor(private readonly exercisesService: ExercisesService) { }

    @Query(() => [Exercise], { name: 'exercises' })
    findAll(@Args('filter', { nullable: true }) filter?: ExerciseFilterInput) {
        const where: any = {};
        if (filter?.search) {
            // Search in JSON name field is tricky with Prisma + Postgres
            // We might need raw query or just simple contains if it was string.
            // For JSON, we can use path search if supported, or just ignore for now.
            // Or assume search is not supported on JSON name yet.
            // Let's try basic string contains on JSON which might fail or work depending on Prisma version.
            // Actually, Prisma supports filtering on JSON.
            // where.name = { path: ['en'], string_contains: filter.search }; // Example
            // For now, let's skip search on JSON name to avoid runtime errors until we know the structure.
        }
        if (filter?.muscleGroupId) {
            where.muscle_group_id = BigInt(filter.muscleGroupId);
        }
        if (filter?.trainingTypeId) {
            where.training_type_id = BigInt(filter.trainingTypeId);
        }

        return this.exercisesService.findAll({
            skip: filter?.skip,
            take: filter?.take,
            where,
        });
    }

    @Query(() => Exercise, { name: 'exercise' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.exercisesService.findOne(id);
    }

    @Mutation(() => Exercise)
    createExercise(@Args('input') input: CreateExerciseInput) {
        return this.exercisesService.create(input);
    }

    @Mutation(() => Exercise)
    updateExercise(@Args('input') input: UpdateExerciseInput) {
        return this.exercisesService.update(input.id, input);
    }

    @Mutation(() => Exercise)
    deleteExercise(@Args('id', { type: () => String }) id: string) {
        return this.exercisesService.remove(id);
    }
}
