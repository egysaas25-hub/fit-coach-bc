import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { INestApplication } from '@nestjs/common';

describe('PrismaService', () => {
    let service: PrismaService;
    let app: INestApplication;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PrismaService],
        }).compile();

        service = module.get<PrismaService>(PrismaService);
        app = module.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Property Test 2: Prisma Service Singleton', () => {
        it('should return the same instance when requested multiple times', async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [PrismaService],
            }).compile();

            const instance1 = module.get<PrismaService>(PrismaService);
            const instance2 = module.get<PrismaService>(PrismaService);

            expect(instance1).toBe(instance2);
            expect(instance1).toBeInstanceOf(PrismaService);
        });
    });

    describe('Connection Lifecycle', () => {
        it('should connect on module init', async () => {
            const connectSpy = jest.spyOn(service, '$connect' as any);
            await service.onModuleInit();
            expect(connectSpy).toHaveBeenCalled();
        });

        it('should disconnect on module destroy', async () => {
            const disconnectSpy = jest.spyOn(service, '$disconnect' as any);
            await service.onModuleDestroy();
            expect(disconnectSpy).toHaveBeenCalled();
        });
    });

    describe('Database Cleanup', () => {
        it('should throw error when trying to clean database in production', async () => {
            process.env.NODE_ENV = 'production';
            await expect(service.cleanDatabase()).rejects.toThrow(
                'Cannot clean database in production',
            );
            process.env.NODE_ENV = 'test';
        });
    });
});
