import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { DashboardMetrics, ClientAnalytics, BusinessAnalytics } from './entities/analytics.entity';
import { DateRangeInput } from './dto/date-range.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver()
@UseGuards(JwtAuthGuard)
export class AnalyticsResolver {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Query(() => DashboardMetrics, { name: 'dashboardMetrics' })
    getDashboardMetrics(
        @Args('filter', { nullable: true }) filter?: DateRangeInput,
    ) {
        return this.analyticsService.getDashboardMetrics(filter);
    }

    @Query(() => ClientAnalytics, { name: 'clientAnalytics' })
    getClientAnalytics(
        @Args('customerId', { type: () => String }) customerId: string,
        @Args('filter', { nullable: true }) filter?: DateRangeInput,
    ) {
        return this.analyticsService.getClientAnalytics(customerId, filter);
    }

    @Query(() => BusinessAnalytics, { name: 'businessAnalytics' })
    getBusinessAnalytics(
        @Args('filter', { nullable: true }) filter?: DateRangeInput,
    ) {
        return this.analyticsService.getBusinessAnalytics(filter);
    }
}
