import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import * as Sentry from '@sentry/node';
import { ErrorCode } from '../errors/error-codes.enum';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const contextType = host.getType<GqlContextType>();

        // Determine if this is a GraphQL or HTTP context
        if (contextType === 'graphql') {
            return this.handleGraphQLException(exception, host);
        } else {
            return this.handleHttpException(exception, host);
        }
    }

    private handleGraphQLException(exception: unknown, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        const info = gqlHost.getInfo();
        const context = gqlHost.getContext();

        const errorResponse = this.buildErrorResponse(exception);

        // Log the error
        this.logError(exception, {
            type: 'GraphQL',
            operation: info?.fieldName,
            path: info?.path,
            userId: context?.req?.user?.id,
        });

        // Report to Sentry
        if (errorResponse.statusCode >= 500) {
            this.reportToSentry(exception, context?.req);
        }

        // Return GraphQL formatted error
        throw new GraphQLError(errorResponse.message, {
            extensions: {
                code: errorResponse.code,
                statusCode: errorResponse.statusCode,
                timestamp: errorResponse.timestamp,
                ...(process.env.NODE_ENV === 'development' && errorResponse.stack
                    ? { stack: errorResponse.stack }
                    : {}),
            },
        });
    }

    private handleHttpException(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const errorResponse = this.buildErrorResponse(exception);

        // Log the error
        this.logError(exception, {
            type: 'HTTP',
            method: request.method,
            url: request.url,
            userId: request?.user?.id,
        });

        // Report to Sentry
        if (errorResponse.statusCode >= 500) {
            this.reportToSentry(exception, request);
        }

        // Return HTTP formatted error
        response.status(errorResponse.statusCode).json(errorResponse);
    }

    private buildErrorResponse(exception: unknown) {
        const timestamp = new Date().toISOString();
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let code = ErrorCode.INTERNAL_SERVER_ERROR;
        let stack: string | undefined;

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse() as any;

            if (typeof exceptionResponse === 'object') {
                message = exceptionResponse.message || message;
                code = exceptionResponse.code || ErrorCode.INTERNAL_SERVER_ERROR;
            } else {
                message = exceptionResponse;
            }

            if (process.env.NODE_ENV === 'development') {
                stack = exception.stack;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            stack = process.env.NODE_ENV === 'development' ? exception.stack : undefined;
        }

        // Sanitize error message in production
        if (process.env.NODE_ENV === 'production' && statusCode >= 500) {
            message = 'An unexpected error occurred';
        }

        return {
            statusCode,
            message,
            code,
            timestamp,
            stack,
        };
    }

    private logError(exception: unknown, context: any) {
        const errorMessage = exception instanceof Error ? exception.message : String(exception);
        const stack = exception instanceof Error ? exception.stack : undefined;

        this.logger.error(
            `[${context.type}] ${errorMessage}`,
            stack,
            JSON.stringify({
                ...context,
                timestamp: new Date().toISOString(),
            }),
        );
    }

    private reportToSentry(exception: unknown, request?: any) {
        if (!process.env.SENTRY_DSN) {
            return;
        }

        Sentry.withScope((scope) => {
            if (request) {
                scope.setUser({
                    id: request.user?.id,
                    email: request.user?.email,
                });

                scope.setContext('request', {
                    method: request.method,
                    url: request.url,
                    headers: this.sanitizeHeaders(request.headers),
                });
            }

            Sentry.captureException(exception);
        });
    }

    private sanitizeHeaders(headers: any): any {
        const sanitized = { ...headers };
        const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];

        sensitiveHeaders.forEach((header) => {
            if (sanitized[header]) {
                sanitized[header] = '[REDACTED]';
            }
        });

        return sanitized;
    }
}
