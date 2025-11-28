import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgressEntryInput } from './dto/create-progress-entry.input';
import { UpdateProgressEntryInput } from './dto/update-progress-entry.input';
import { ProgressEntry } from './entities/progress-entry.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProgressService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateProgressEntryInput): Promise<ProgressEntry> {
        const entry = await this.prisma.progress_tracking.create({
            data: {
                tenant_id: BigInt(data.tenantId),
                customer_id: BigInt(data.customerId),
                weight_kg: data.weightKg,
                workout_done: data.workoutDone,
                sleep_hours: data.sleepHours,
                pain_score: data.painScore,
                notes: data.notes,
                recorded_at: data.recordedAt ? new Date(data.recordedAt) : new Date(),
            },
        });
        return this.mapToProgressEntry(entry);
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.progress_trackingWhereInput;
        orderBy?: Prisma.progress_trackingOrderByWithRelationInput[];
    }): Promise<ProgressEntry[]> {
        const entries = await this.prisma.progress_tracking.findMany({
            skip: params.skip,
            take: params.take,
            where: params.where,
            orderBy: params.orderBy || [{ recorded_at: 'desc' }],
        });
        return entries.map((entry) => this.mapToProgressEntry(entry));
    }

    async findOne(id: string): Promise<ProgressEntry | null> {
        const entry = await this.prisma.progress_tracking.findUnique({
            where: { id: BigInt(id) },
        });
        return entry ? this.mapToProgressEntry(entry) : null;
    }

    async update(id: string, data: UpdateProgressEntryInput): Promise<ProgressEntry> {
        const updateData: Prisma.progress_trackingUpdateInput = {};
        if (data.weightKg !== undefined) updateData.weight_kg = data.weightKg;
        if (data.workoutDone !== undefined) updateData.workout_done = data.workoutDone;
        if (data.sleepHours !== undefined) updateData.sleep_hours = data.sleepHours;
        if (data.painScore !== undefined) updateData.pain_score = data.painScore;
        if (data.notes !== undefined) updateData.notes = data.notes;
        if (data.recordedAt !== undefined)
            updateData.recorded_at = new Date(data.recordedAt);

        const entry = await this.prisma.progress_tracking.update({
            where: { id: BigInt(id) },
            data: updateData,
        });
        return this.mapToProgressEntry(entry);
    }

    async remove(id: string): Promise<ProgressEntry> {
        const entry = await this.prisma.progress_tracking.delete({
            where: { id: BigInt(id) },
        });
        return this.mapToProgressEntry(entry);
    }

    private mapToProgressEntry(entry: any): ProgressEntry {
        return {
            id: entry.id.toString(),
            tenantId: entry.tenant_id.toString(),
            customerId: entry.customer_id.toString(),
            weightKg: entry.weight_kg?.toNumber(),
            workoutDone: entry.workout_done,
            sleepHours: entry.sleep_hours?.toNumber(),
            painScore: entry.pain_score,
            notes: entry.notes,
            recordedAt: entry.recorded_at,
        };
    }
}
