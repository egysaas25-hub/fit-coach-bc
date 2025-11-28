import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutInput } from './dto/create-workout.input';
import { UpdateWorkoutInput } from './dto/update-workout.input';
import { Workout } from './entities/workout.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkoutsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateWorkoutInput): Promise<Workout> {
        const workout = await this.prisma.training_plans.create({
            data: {
                tenant_id: BigInt(data.tenantId),
                customer_id: BigInt(data.customerId),
                version: 1, // Default version
                is_active: data.isActive ?? true,
                split: data.split,
                notes: data.notes,
                created_by: BigInt(1), // TODO: Get from context/auth
                training_plan_exercises: data.exercises
                    ? {
                        create: data.exercises.map((e) => ({
                            exercise_id: BigInt(e.exerciseId),
                            sets: e.sets,
                            reps: e.reps,
                            order_index: e.orderIndex,
                        })),
                    }
                    : undefined,
            },
            include: { training_plan_exercises: { include: { exercises: true } } },
        });
        return this.mapToWorkout(workout);
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.training_plansWhereInput;
    }): Promise<Workout[]> {
        const workouts = await this.prisma.training_plans.findMany({
            skip: params.skip,
            take: params.take,
            where: params.where,
            include: { training_plan_exercises: { include: { exercises: true } } },
        });
        return workouts.map((w) => this.mapToWorkout(w));
    }

    async findOne(id: string): Promise<Workout | null> {
        const workout = await this.prisma.training_plans.findUnique({
            where: { id: BigInt(id) },
            include: { training_plan_exercises: { include: { exercises: true } } },
        });
        return workout ? this.mapToWorkout(workout) : null;
    }

    async update(id: string, data: UpdateWorkoutInput): Promise<Workout> {
        const updateData: Prisma.training_plansUpdateInput = {};
        if (data.split !== undefined) updateData.split = data.split;
        if (data.notes !== undefined) updateData.notes = data.notes;
        if (data.isActive !== undefined) updateData.is_active = data.isActive;

        // Handle exercises update if provided (replace all strategy for simplicity, or complex diff)
        // For now, if exercises are provided, we delete existing and create new ones.
        if (data.exercises) {
            updateData.training_plan_exercises = {
                deleteMany: {},
                create: data.exercises.map((e) => ({
                    exercise_id: BigInt(e.exerciseId),
                    sets: e.sets,
                    reps: e.reps,
                    order_index: e.orderIndex,
                })),
            };
        }

        const workout = await this.prisma.training_plans.update({
            where: { id: BigInt(id) },
            data: updateData,
            include: { training_plan_exercises: { include: { exercises: true } } },
        });
        return this.mapToWorkout(workout);
    }

    async remove(id: string): Promise<Workout> {
        const workout = await this.prisma.training_plans.delete({
            where: { id: BigInt(id) },
            include: { training_plan_exercises: { include: { exercises: true } } },
        });
        return this.mapToWorkout(workout);
    }

    private mapToWorkout(workout: any): Workout {
        return {
            id: workout.id.toString(),
            tenantId: workout.tenant_id.toString(),
            customerId: workout.customer_id.toString(),
            version: workout.version,
            isActive: workout.is_active,
            split: workout.split,
            notes: workout.notes,
            createdBy: workout.created_by.toString(),
            createdAt: workout.created_at,
            exercises: workout.training_plan_exercises?.map((tpe: any) => ({
                id: tpe.id.toString(),
                planId: tpe.plan_id.toString(),
                exerciseId: tpe.exercise_id.toString(),
                sets: tpe.sets,
                reps: tpe.reps,
                orderIndex: tpe.order_index,
                exercise: tpe.exercises
                    ? {
                        id: tpe.exercises.id.toString(),
                        tenantId: tpe.exercises.tenant_id.toString(),
                        name: tpe.exercises.name,
                        description: tpe.exercises.description,
                        muscleGroupId: tpe.exercises.muscle_group_id?.toString(),
                        trainingTypeId: tpe.exercises.training_type_id?.toString(),
                        equipmentNeeded: tpe.exercises.equipment_needed,
                        caloriesBurnedPerMin: tpe.exercises.calories_burned_per_min?.toNumber(),
                        createdAt: tpe.exercises.created_at,
                    }
                    : undefined,
            })),
        };
    }
}
