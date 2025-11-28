import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { DateScalar } from './common/scalars/date.scalar';

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
            playground: process.env.NODE_ENV !== 'production',
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
    ],
    providers: [DateScalar],
})
export class AppModule { }
