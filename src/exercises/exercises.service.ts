import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseInput } from './dto/create-exercise.input';
import { UpdateExerciseInput } from './dto/update-exercise.input';
import { Exercise } from './entities/exercise.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExercisesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateExerciseInput): Promise<Exercise> {
        const exercise = await this.prisma.exercises.create({
            data: {
                tenant_id: BigInt(data.tenantId),
                name: data.name,
                description: data.description ?? Prisma.JsonNull,
                muscle_group_id: data.muscleGroupId ? BigInt(data.muscleGroupId) : null,
                training_type_id: data.trainingTypeId ? BigInt(data.trainingTypeId) : null,
                equipment_needed: data.equipmentNeeded,
                calories_burned_per_min: data.caloriesBurnedPerMin,
            },
        });
        return this.mapToExercise(exercise);
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.exercisesWhereInput;
    }): Promise<Exercise[]> {
        const exercises = await this.prisma.exercises.findMany({
            skip: params.skip,
            take: params.take,
            where: params.where,
        });
        return exercises.map((e) => this.mapToExercise(e));
    }

    async findOne(id: string): Promise<Exercise | null> {
        const exercise = await this.prisma.exercises.findUnique({
            where: { id: BigInt(id) },
        });
        return exercise ? this.mapToExercise(exercise) : null;
    }

    async update(id: string, data: UpdateExerciseInput): Promise<Exercise> {
        const updateData: Prisma.exercisesUpdateInput = {};
        if (data.name) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description ?? Prisma.JsonNull;
        if (data.muscleGroupId !== undefined)
            updateData.muscle_groups = data.muscleGroupId
                ? { connect: { id: BigInt(data.muscleGroupId) } }
                : { disconnect: true };
        if (data.trainingTypeId !== undefined)
            updateData.training_types = data.trainingTypeId
                ? { connect: { id: BigInt(data.trainingTypeId) } }
                : { disconnect: true };
        if (data.equipmentNeeded !== undefined) updateData.equipment_needed = data.equipmentNeeded;
        if (data.caloriesBurnedPerMin !== undefined)
            updateData.calories_burned_per_min = data.caloriesBurnedPerMin;

        const exercise = await this.prisma.exercises.update({
            where: { id: BigInt(id) },
            data: updateData,
        });
        return this.mapToExercise(exercise);
    }

    async remove(id: string): Promise<Exercise> {
        const exercise = await this.prisma.exercises.delete({
            where: { id: BigInt(id) },
        });
        return this.mapToExercise(exercise);
    }

    async findByIds(ids: string[]): Promise<Exercise[]> {
        const exercises = await this.prisma.exercises.findMany({
            where: {
                id: { in: ids.map((id) => BigInt(id)) },
            },
        });
        return exercises.map((e) => this.mapToExercise(e));
    }

    private mapToExercise(exercise: any): Exercise {
        return {
            id: exercise.id.toString(),
            tenantId: exercise.tenant_id.toString(),
            name: exercise.name,
            description: exercise.description,
            muscleGroupId: exercise.muscle_group_id?.toString(),
            trainingTypeId: exercise.training_type_id?.toString(),
            equipmentNeeded: exercise.equipment_needed,
            caloriesBurnedPerMin: exercise.calories_burned_per_min?.toNumber(),
            createdAt: exercise.created_at,
        };
    }
}
