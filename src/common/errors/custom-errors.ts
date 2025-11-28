import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-codes.enum';

export class ValidationException extends HttpException {
    constructor(message: string, details?: any) {
        super(
            {
                message,
                code: ErrorCode.VALIDATION_ERROR,
                statusCode: HttpStatus.BAD_REQUEST,
                details,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}

export class AuthenticationException extends HttpException {
    constructor(message: string = 'Authentication failed') {
        super(
            {
                message,
                code: ErrorCode.AUTHENTICATION_ERROR,
                statusCode: HttpStatus.UNAUTHORIZED,
            },
            HttpStatus.UNAUTHORIZED,
        );
    }
}

export class AuthorizationException extends HttpException {
    constructor(message: string = 'Insufficient permissions') {
        super(
            {
                message,
                code: ErrorCode.AUTHORIZATION_ERROR,
                statusCode: HttpStatus.FORBIDDEN,
            },
            HttpStatus.FORBIDDEN,
        );
    }
}

export class NotFoundException extends HttpException {
    constructor(resource: string = 'Resource') {
        super(
            {
                message: `${resource} not found`,
                code: ErrorCode.NOT_FOUND,
                statusCode: HttpStatus.NOT_FOUND,
            },
            HttpStatus.NOT_FOUND,
        );
    }
}

export class DatabaseException extends HttpException {
    constructor(message: string = 'Database operation failed', originalError?: any) {
        super(
            {
                message,
                code: ErrorCode.DATABASE_ERROR,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                originalError: process.env.NODE_ENV === 'development' ? originalError : undefined,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}

export class ExternalServiceException extends HttpException {
    constructor(service: string, message?: string) {
        super(
            {
                message: message || `External service ${service} failed`,
                code: ErrorCode.EXTERNAL_SERVICE_ERROR,
                statusCode: HttpStatus.BAD_GATEWAY,
                service,
            },
            HttpStatus.BAD_GATEWAY,
        );
    }
}

export class ConflictException extends HttpException {
    constructor(message: string = 'Resource conflict') {
        super(
            {
                message,
                code: ErrorCode.CONFLICT,
                statusCode: HttpStatus.CONFLICT,
            },
            HttpStatus.CONFLICT,
        );
    }
}
