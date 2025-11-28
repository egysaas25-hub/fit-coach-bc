import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import * as Sentry from '@sentry/node';

async function bootstrap() {
    // Initialize Sentry
    if (process.env.SENTRY_DSN) {
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV || 'development',
            tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        });
    }

    const app = await NestFactory.create(AppModule);

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Global exception filter
    app.useGlobalFilters(new AllExceptionsFilter());

    // Enable CORS
    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    });

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📊 GraphQL Playground: http://localhost:${port}/graphql`);
}

bootstrap();
