import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prisma = app.get<PrismaService>(PrismaService);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Property Test 3: Global Prisma Availability', () => {
        it('should have PrismaService available globally without explicit import', () => {
            expect(prisma).toBeDefined();
            expect(prisma).toBeInstanceOf(PrismaService);
        });
    });

    describe('GraphQL Endpoint', () => {
        it('/graphql (POST) should be accessible', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: '{ __typename }',
                })
                .expect(200);
        });
    });

    describe('Health Check', () => {
        it('should have GraphQL introspection enabled in development', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: `
            {
              __schema {
                queryType {
                  name
                }
              }
            }
          `,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.data).toBeDefined();
                    expect(res.body.data.__schema).toBeDefined();
                });
        });
    });
});
