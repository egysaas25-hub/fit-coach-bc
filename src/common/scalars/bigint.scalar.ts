import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('BigInt', () => String)
export class BigIntScalar implements CustomScalar<string, bigint> {
    description = 'BigInt custom scalar type';

    parseValue(value: string): bigint {
        return BigInt(value);
    }

    serialize(value: bigint): string {
        return value.toString();
    }

    parseLiteral(ast: ValueNode): bigint {
        if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
            return BigInt(ast.value);
        }
        throw new Error('Invalid BigInt value');
    }
}
