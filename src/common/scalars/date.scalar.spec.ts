import { DateScalar } from './date.scalar';
import { Kind } from 'graphql';

describe('DateScalar', () => {
    let dateScalar: DateScalar;

    beforeEach(() => {
        dateScalar = new DateScalar();
    });

    describe('Property Test 5: Date Scalar Round-Trip', () => {
        it('should serialize and parse date without data loss', () => {
            const originalDate = new Date('2024-01-15T10:30:00.000Z');

            // Serialize to string
            const serialized = dateScalar.serialize(originalDate);
            expect(typeof serialized).toBe('string');
            expect(serialized).toBe(originalDate.toISOString());

            // Parse back to Date
            const parsed = dateScalar.parseValue(serialized);
            expect(parsed).toBeInstanceOf(Date);
            expect(parsed.getTime()).toBe(originalDate.getTime());
        });

        it('should handle multiple round trips without degradation', () => {
            const originalDate = new Date('2024-06-20T15:45:30.123Z');

            for (let i = 0; i < 10; i++) {
                const serialized = dateScalar.serialize(originalDate);
                const parsed = dateScalar.parseValue(serialized);
                expect(parsed.getTime()).toBe(originalDate.getTime());
            }
        });
    });

    describe('serialize', () => {
        it('should serialize a Date to ISO string', () => {
            const date = new Date('2024-01-01T00:00:00.000Z');
            const result = dateScalar.serialize(date);
            expect(result).toBe('2024-01-01T00:00:00.000Z');
        });

        it('should throw error for invalid date', () => {
            const invalidDate = new Date('invalid');
            expect(() => dateScalar.serialize(invalidDate)).toThrow('Invalid date value');
        });

        it('should throw error for non-Date value', () => {
            expect(() => dateScalar.serialize('not a date')).toThrow('Invalid date value');
        });
    });

    describe('parseValue', () => {
        it('should parse ISO string to Date', () => {
            const result = dateScalar.parseValue('2024-01-01T00:00:00.000Z');
            expect(result).toBeInstanceOf(Date);
            expect(result.toISOString()).toBe('2024-01-01T00:00:00.000Z');
        });

        it('should parse number (timestamp) to Date', () => {
            const timestamp = new Date('2024-01-01').getTime();
            const result = dateScalar.parseValue(timestamp);
            expect(result).toBeInstanceOf(Date);
            expect(result.getTime()).toBe(timestamp);
        });

        it('should throw error for invalid string', () => {
            expect(() => dateScalar.parseValue('invalid date')).toThrow('Invalid date value');
        });
    });

    describe('parseLiteral', () => {
        it('should parse string literal to Date', () => {
            const ast = {
                kind: Kind.STRING,
                value: '2024-01-01T00:00:00.000Z',
            };
            const result = dateScalar.parseLiteral(ast as any);
            expect(result).toBeInstanceOf(Date);
            expect(result.toISOString()).toBe('2024-01-01T00:00:00.000Z');
        });

        it('should parse int literal to Date', () => {
            const timestamp = new Date('2024-01-01').getTime().toString();
            const ast = {
                kind: Kind.INT,
                value: timestamp,
            };
            const result = dateScalar.parseLiteral(ast as any);
            expect(result).toBeInstanceOf(Date);
        });

        it('should throw error for invalid literal type', () => {
            const ast = {
                kind: Kind.BOOLEAN,
                value: true,
            };
            expect(() => dateScalar.parseLiteral(ast as any)).toThrow('Invalid date literal');
        });

        it('should throw error for invalid date string in literal', () => {
            const ast = {
                kind: Kind.STRING,
                value: 'invalid',
            };
            expect(() => dateScalar.parseLiteral(ast as any)).toThrow('Invalid date literal');
        });
    });
});
