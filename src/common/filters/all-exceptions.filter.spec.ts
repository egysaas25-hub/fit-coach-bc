import { Test, TestingModule } from '@nestjs/testing';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { ErrorCode } from '../errors/error-codes.enum';

describe('AllExceptionsFilter', () => {
    let filter: AllExceptionsFilter;

    beforeEach(() => {
        filter = new AllExceptionsFilter();
    });

    describe('Property Test 6: GraphQL Error Format Consistency', () => {
        it('should format all error types consistently in GraphQL context', () => {
            const testErrors = [
                new HttpException('Test error', HttpStatus.BAD_REQUEST),
                new HttpException(
                    { message: 'Custom error', code: ErrorCode.VALIDATION_ERROR },
                    HttpStatus.BAD_REQUEST,
                ),
                new Error('Generic error'),
            ];

            testErrors.forEach((error) => {
                const response = (filter as any).buildErrorResponse(error);

                expect(response).toHaveProperty('statusCode');
                expect(response).toHaveProperty('message');
                expect(response).toHaveProperty('code');
                expect(response).toHaveProperty('timestamp');

                expect(typeof response.statusCode).toBe('number');
                expect(typeof response.message).toBe('string');
                expect(typeof response.code).toBe('string');
                expect(typeof response.timestamp).toBe('string');
            });
        });
    });

    describe('buildErrorResponse', () => {
        it('should handle HttpException correctly', () => {
            const exception = new HttpException('Test error', HttpStatus.NOT_FOUND);
            const response = (filter as any).buildErrorResponse(exception);

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
            expect(response.message).toBe('Test error');
            expect(response.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
            expect(response.timestamp).toBeDefined();
        });

        it('should handle HttpException with custom response object', () => {
            const exception = new HttpException(
                {
                    message: 'Validation failed',
                    code: ErrorCode.VALIDATION_ERROR,
                },
                HttpStatus.BAD_REQUEST,
            );
            const response = (filter as any).buildErrorResponse(exception);

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
            expect(response.message).toBe('Validation failed');
            expect(response.code).toBe(ErrorCode.VALIDATION_ERROR);
        });

        it('should handle generic Error', () => {
            const error = new Error('Something went wrong');
            const response = (filter as any).buildErrorResponse(error);

            expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(response.message).toBe('Something went wrong');
            expect(response.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
        });

        it('should sanitize 500 errors in production', () => {
            process.env.NODE_ENV = 'production';
            const exception = new HttpException('Internal error', HttpStatus.INTERNAL_SERVER_ERROR);
            const response = (filter as any).buildErrorResponse(exception);

            expect(response.message).toBe('An unexpected error occurred');

            process.env.NODE_ENV = 'test';
        });

        it('should include stack trace in development', () => {
            process.env.NODE_ENV = 'development';
            const error = new Error('Test error');
            const response = (filter as any).buildErrorResponse(error);

            expect(response.stack).toBeDefined();

            process.env.NODE_ENV = 'test';
        });
    });

    describe('sanitizeHeaders', () => {
        it('should redact sensitive headers', () => {
            const headers = {
                authorization: 'Bearer token123',
                cookie: 'session=abc',
                'x-api-key': 'secret',
                'content-type': 'application/json',
            };

            const sanitized = (filter as any).sanitizeHeaders(headers);

            expect(sanitized.authorization).toBe('[REDACTED]');
            expect(sanitized.cookie).toBe('[REDACTED]');
            expect(sanitized['x-api-key']).toBe('[REDACTED]');
            expect(sanitized['content-type']).toBe('application/json');
        });
    });
});
