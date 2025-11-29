import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardMetrics, ClientAnalytics, BusinessAnalytics } from './entities/analytics.entity';
import { DateRangeInput } from './dto/date-range.input';

@Injectable()
export class AnalyticsService {
    constructor(private readonly prisma: PrismaService) { }

    async getDashboardMetrics(filter?: DateRangeInput): Promise<DashboardMetrics> {
        const where = this.buildDateRangeWhere(filter);

        // Get total and active customers
        const totalCustomers = await this.prisma.customers.count({ where });
        const activeCustomers = await this.prisma.customers.count({
            where: {
                ...where,
                status: 'active',
            },
        });

        // Get total workouts and nutrition plans
        const totalWorkouts = await this.prisma.training_plans.count({ where });
        const totalNutritionPlans = await this.prisma.nutrition_plans.count({ where });

        // Calculate average workouts per customer
        const averageWorkoutsPerCustomer = totalCustomers > 0
            ? totalWorkouts / totalCustomers
            : 0;

        // Calculate retention rate (active / total)
        const customerRetentionRate = totalCustomers > 0
            ? (activeCustomers / totalCustomers) * 100
            : 0;

        return {
            totalCustomers,
            activeCustomers,
            totalWorkouts,
            totalNutritionPlans,
            averageWorkoutsPerCustomer: Number(averageWorkoutsPerCustomer.toFixed(2)),
            customerRetentionRate: Number(customerRetentionRate.toFixed(2)),
        };
    }

    async getClientAnalytics(customerId: string, filter?: DateRangeInput): Promise<ClientAnalytics> {
        const customer = await this.prisma.customers.findUnique({
            where: { id: BigInt(customerId) },
        });

        if (!customer) {
            throw new Error('Customer not found');
        }

        const dateWhere = filter ? {
            created_at: this.buildDateFilter(filter),
        } : {};

        // Count workouts
        const workoutsCompleted = await this.prisma.training_plans.count({
            where: {
                customer_id: BigInt(customerId),
                ...dateWhere,
            },
        });

        // Count nutrition plan meals as "meals logged"
        const mealsLogged = await this.prisma.nutrition_meals.count({
            where: {
                nutrition_plans: {
                    customer_id: BigInt(customerId),
                },
            },
        });

        // Count progress entries
        const progressEntries = await this.prisma.progress_tracking.count({
            where: {
                customer_id: BigInt(customerId),
                ...dateWhere,
            },
        });

        // Calculate weight change
        const progressData = await this.prisma.progress_tracking.findMany({
            where: {
                customer_id: BigInt(customerId),
                weight_kg: { not: null },
            },
            orderBy: { recorded_at: 'asc' },
            take: 2,
        });

        let weightChange: number | undefined;
        if (progressData.length >= 2) {
            const first = progressData[0].weight_kg?.toNumber();
            const last = progressData[progressData.length - 1].weight_kg?.toNumber();
            if (first && last) {
                weightChange = Number((last - first).toFixed(2));
            }
        }

        // Get last activity
        const lastProgress = await this.prisma.progress_tracking.findFirst({
            where: { customer_id: BigInt(customerId) },
            orderBy: { recorded_at: 'desc' },
        });

        return {
            customerId,
            customerName: customer.phone_e164 || 'Unknown',
            workoutsCompleted,
            mealsLogged,
            progressEntries,
            weightChange,
            lastActivity: lastProgress?.recorded_at,
        };
    }

    async getBusinessAnalytics(filter?: DateRangeInput): Promise<BusinessAnalytics> {
        const where = this.buildDateRangeWhere(filter);

        // Get new customers this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const newCustomersThisMonth = await this.prisma.customers.count({
            where: {
                ...where,
                created_at: { gte: startOfMonth },
            },
        });

        // Get active workflows
        const activeWorkflows = await this.prisma.automation_workflows.count({
            where: {
                ...where,
                is_active: true,
            },
        });

        // Count messages exchanged
        const inboundMessages = await this.prisma.inbound_messages.count({ where });
        const outboundMessages = await this.prisma.outbound_messages.count({ where });
        const messagesExchanged = inboundMessages + outboundMessages;

        // Mock metrics for now
        const averageResponseTime = 2.5; // hours
        const customerSatisfactionScore = 4.5; // out of 5

        return {
            newCustomersThisMonth,
            activeWorkflows,
            messagesExchanged,
            averageResponseTime,
            customerSatisfactionScore,
        };
    }

    private buildDateRangeWhere(filter?: DateRangeInput): any {
        const where: any = {};

        if (filter?.tenantId) {
            where.tenant_id = BigInt(filter.tenantId);
        }

        if (filter?.startDate || filter?.endDate) {
            where.created_at = this.buildDateFilter(filter);
        }

        return where;
    }

    private buildDateFilter(filter: DateRangeInput): any {
        const dateFilter: any = {};

        if (filter.startDate) {
            dateFilter.gte = new Date(filter.startDate);
        }

        if (filter.endDate) {
            dateFilter.lte = new Date(filter.endDate);
        }

        return dateFilter;
    }
}
