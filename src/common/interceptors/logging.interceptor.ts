import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const contextType = context.getType<GqlContextType>();
        const startTime = Date.now();

        if (contextType === 'graphql') {
            return this.handleGraphQL(context, next, startTime);
        } else {
            return this.handleHttp(context, next, startTime);
        }
    }

    private handleGraphQL(context: ExecutionContext, next: CallHandler, startTime: number) {
        const gqlContext = GqlExecutionContext.create(context);
        const info = gqlContext.getInfo();
        const ctx = gqlContext.getContext();

        const operation = info.fieldName;
        const userId = ctx.req?.user?.id || 'anonymous';

        this.logger.log(`[GraphQL] ${operation} - START - User: ${userId}`);

        return next.handle().pipe(
            tap({
                next: () => {
                    const duration = Date.now() - startTime;
                    this.logger.log(
                        `[GraphQL] ${operation} - SUCCESS - Duration: ${duration}ms - User: ${userId}`,
                    );
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    this.logger.error(
                        `[GraphQL] ${operation} - ERROR - Duration: ${duration}ms - User: ${userId}`,
                        error.stack,
                    );
                },
            }),
        );
    }

    private handleHttp(context: ExecutionContext, next: CallHandler, startTime: number) {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const userId = request.user?.id || 'anonymous';

        this.logger.log(`[HTTP] ${method} ${url} - START - User: ${userId}`);

        return next.handle().pipe(
            tap({
                next: () => {
                    const duration = Date.now() - startTime;
                    const response = context.switchToHttp().getResponse();
                    this.logger.log(
                        `[HTTP] ${method} ${url} - ${response.statusCode} - Duration: ${duration}ms - User: ${userId}`,
                    );
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    this.logger.error(
                        `[HTTP] ${method} ${url} - ERROR - Duration: ${duration}ms - User: ${userId}`,
                        error.stack,
                    );
                },
            }),
        );
    }
}
