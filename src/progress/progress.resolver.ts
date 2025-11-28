import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressEntry } from './entities/progress-entry.entity';
import { CreateProgressEntryInput } from './dto/create-progress-entry.input';
import { UpdateProgressEntryInput } from './dto/update-progress-entry.input';
import { ProgressFilterInput } from './dto/progress-filter.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => ProgressEntry)
@UseGuards(JwtAuthGuard)
export class ProgressResolver {
    constructor(private readonly progressService: ProgressService) { }

    @Query(() => [ProgressEntry], { name: 'progressEntries' })
    findAll(@Args('filter', { nullable: true }) filter?: ProgressFilterInput) {
        const where: any = {};

        if (filter?.customerId) {
            where.customer_id = BigInt(filter.customerId);
        }

        // Time-series filtering
        if (filter?.startDate || filter?.endDate) {
            where.recorded_at = {};
            if (filter.startDate) {
                where.recorded_at.gte = new Date(filter.startDate);
            }
            if (filter.endDate) {
                where.recorded_at.lte = new Date(filter.endDate);
            }
        }

        return this.progressService.findAll({
            skip: filter?.skip,
            take: filter?.take,
            where,
            orderBy: [{ recorded_at: 'desc' }],
        });
    }

    @Query(() => ProgressEntry, { name: 'progressEntry' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.progressService.findOne(id);
    }

    @Mutation(() => ProgressEntry)
    createProgressEntry(@Args('input') input: CreateProgressEntryInput) {
        return this.progressService.create(input);
    }

    @Mutation(() => ProgressEntry)
    updateProgressEntry(@Args('input') input: UpdateProgressEntryInput) {
        return this.progressService.update(input.id, input);
    }

    @Mutation(() => ProgressEntry)
    deleteProgressEntry(@Args('id', { type: () => String }) id: string) {
        return this.progressService.remove(id);
    }
}
