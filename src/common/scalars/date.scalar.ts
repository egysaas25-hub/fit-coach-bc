import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
    description = 'Date custom scalar type';

    parseValue(value: unknown): Date {
        if (typeof value === 'number' || typeof value === 'string') {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date value');
            }
            return date;
        }
        throw new Error('Invalid date value');
    }

    serialize(value: unknown): string {
        if (value instanceof Date) {
            if (isNaN(value.getTime())) {
                throw new Error('Invalid date value');
            }
            return value.toISOString();
        }
        throw new Error('Invalid date value');
    }

    parseLiteral(ast: ValueNode): Date {
        if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
            const date = new Date(ast.value);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date literal');
            }
            return date;
        }
        throw new Error('Invalid date literal');
    }
}
