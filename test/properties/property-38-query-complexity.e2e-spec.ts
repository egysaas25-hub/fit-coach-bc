import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from '../../src/app.module';

describe('Property 38: Query Complexity Limits', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    it('should reject queries that exceed complexity limit', async () => {
        // Construct a query with high complexity
        // We use many aliases to increase complexity without needing a deep schema
        const manyAliases = Array.from({ length: 1001 }, (_, i) => `alias${i}: __typename`).join('\n');
        const complexQuery = `query { ${manyAliases} }`;

        return request(app.getHttpServer())
            .post('/graphql')
            .send({ query: complexQuery })
            .expect(200)
            .expect((res) => {
                expect(res.body.errors).toBeDefined();
                expect(res.body.errors[0].message).toContain('Query is too complex');
            });
    });
});
