import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { Workout } from './entities/workout.entity';
import { CreateWorkoutInput } from './dto/create-workout.input';
import { UpdateWorkoutInput } from './dto/update-workout.input';
import { WorkoutFilterInput } from './dto/workout-filter.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Workout)
@UseGuards(JwtAuthGuard)
export class WorkoutsResolver {
    constructor(private readonly workoutsService: WorkoutsService) { }

    @Query(() => [Workout], { name: 'workouts' })
    findAll(@Args('filter', { nullable: true }) filter?: WorkoutFilterInput) {
        const where: any = {};
        if (filter?.customerId) {
            where.customer_id = BigInt(filter.customerId);
        }
        if (filter?.split) {
            where.split = filter.split;
        }

        return this.workoutsService.findAll({
            skip: filter?.skip,
            take: filter?.take,
            where,
        });
    }

    @Query(() => Workout, { name: 'workout' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.workoutsService.findOne(id);
    }

    @Mutation(() => Workout)
    createWorkout(@Args('input') input: CreateWorkoutInput) {
        return this.workoutsService.create(input);
    }

    @Mutation(() => Workout)
    updateWorkout(@Args('input') input: UpdateWorkoutInput) {
        return this.workoutsService.update(input.id, input);
    }

    @Mutation(() => Workout)
    deleteWorkout(@Args('id', { type: () => String }) id: string) {
        return this.workoutsService.remove(id);
    }
}
