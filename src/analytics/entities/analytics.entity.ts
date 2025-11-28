import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class DashboardMetrics {
    @Field(() => Int)
    totalCustomers: number;

    @Field(() => Int)
    activeCustomers: number;

    @Field(() => Int)
    totalWorkouts: number;

    @Field(() => Int)
    totalNutritionPlans: number;

    @Field(() => Float)
    averageWorkoutsPerCustomer: number;

    @Field(() => Float)
    customerRetentionRate: number;
}

@ObjectType()
export class ClientAnalytics {
    @Field()
    customerId: string;

    @Field()
    customerName: string;

    @Field(() => Int)
    workoutsCompleted: number;

    @Field(() => Int)
    mealsLogged: number;

    @Field(() => Int)
    progressEntries: number;

    @Field(() => Float, { nullable: true })
    weightChange?: number;

    @Field({ nullable: true })
    lastActivity?: Date;
}

@ObjectType()
export class BusinessAnalytics {
    @Field(() => Int)
    newCustomersThisMonth: number;

    @Field(() => Int)
    activeWorkflows: number;

    @Field(() => Int)
    messagesExchanged: number;

    @Field(() => Float)
    averageResponseTime: number;

    @Field(() => Float)
    customerSatisfactionScore: number;
}
