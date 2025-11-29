import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { getComplexity, simpleEstimator } from 'graphql-query-complexity';
import { GraphQLError } from 'graphql';
import { PrismaModule } from './prisma/prisma.module';
import { DateScalar } from './common/scalars/date.scalar';
import { HealthResolver } from './common/resolvers/health.resolver';
import { BigIntScalar } from './common/scalars/bigint.scalar';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { ExercisesModule } from './exercises/exercises.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { NutritionModule } from './nutrition/nutrition.module';
import { AiModule } from './ai/ai.module';
import { ProgressModule } from './progress/progress.module';
import { MessagingModule } from './messaging/messaging.module';
import { AutomationModule } from './automation/automation.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SettingsModule } from './settings/settings.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'schema.gql'),
            sortSchema: true,
            playground: true,
            introspection: true,
            validationRules: [
                (context) => ({
                    Field: {
                        enter: (node) => {
                            const complexity = getComplexity({
                                schema: context.getSchema(),
                                query: context.getDocument(),
                                estimators: [
                                    simpleEstimator({ defaultComplexity: 1 }),
                                ],
                            });
                            if (complexity > 1000) {
                                context.reportError(
                                    new GraphQLError(
                                        `Query is too complex: ${complexity}. Maximum allowed complexity: 1000`,
                                    ),
                                );
                            }
                        },
                    },
                }),
            ],
            formatError: (error) => {
                return {
                    message: error.message,
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
                    statusCode: error.extensions?.statusCode || 500,
                    timestamp: new Date().toISOString(),
                };
            },
        }),
        PrismaModule,
        UsersModule,
        AuthModule,
        CustomersModule,
        ExercisesModule,
        WorkoutsModule,
        NutritionModule,
        AiModule,
        ProgressModule,
        MessagingModule,
        AutomationModule,
        AnalyticsModule,
        SettingsModule,
        SubscriptionsModule,
        UploadsModule,
    ],
    providers: [DateScalar, BigIntScalar, HealthResolver],
})
export class AppModule { }
