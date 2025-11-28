import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

describe('AiService - Property Tests', () => {
    let service: AiService;
    let prisma: PrismaService;

    const mockPrismaService = {
        ai_generation_logs: {
            create: jest.fn(),
        },
    };

    const mockConfigService = {
        get: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AiService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        service = module.get<AiService>(AiService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    describe('Property 33: AI Generation Logging', () => {
        it('should log every AI generation attempt with all required fields', async () => {
            // Given a nutrition plan generation request
            const params = {
                customerId: '123',
                tenantId: '456',
                caloriesTarget: 2000,
                mealsPerDay: 3,
                userId: '789',
            };

            // When generating a nutrition plan
            await service.generateNutritionPlan(params);

            // Then it should log to ai_generation_logs
            expect(mockPrismaService.ai_generation_logs.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        tenant_id: BigInt('456'),
                        generated_by: BigInt('789'),
                        generation_type: 'nutrition_plan',
                        prompt: expect.any(String),
                        parameters: expect.objectContaining(params),
                        response: expect.any(Object),
                        tokens_used: expect.any(Number),
                        cost_usd: expect.any(Number),
                        success: true,
                    }),
                }),
            );

            // Property: tokens_used should be positive
            const callArgs = mockPrismaService.ai_generation_logs.create.mock.calls[0][0];
            expect(callArgs.data.tokens_used).toBeGreaterThan(0);

            // Property: cost_usd should be non-negative
            expect(callArgs.data.cost_usd).toBeGreaterThanOrEqual(0);
        });

        it('should log failures with error_message', async () => {
            // Override mockGenerateNutrition to throw
            jest.spyOn(service as any, 'mockGenerateNutrition').mockRejectedValue(
                new Error('AI API failure'),
            );

            // When generation fails
            await expect(
                service.generateNutritionPlan({
                    customerId: '123',
                    tenantId: '456',
                }),
            ).rejects.toThrow('AI API failure');

            // Then it should log the failure
            expect(mockPrismaService.ai_generation_logs.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        success: false,
                        error_message: 'AI API failure',
                    }),
                }),
            );
        });

        it('should calculate cost proportionally to token usage', async () => {
            await service.generateNutritionPlan({
                customerId: '123',
                tenantId: '456',
            });

            const callArgs = mockPrismaService.ai_generation_logs.create.mock.calls[0][0];
            const tokensUsed = callArgs.data.tokens_used;
            const costUsd = callArgs.data.cost_usd;

            // Property: cost should be proportional to (tokens / 1000) * rate
            const expectedCost = (tokensUsed / 1000) * 0.002;
            expect(Math.abs(costUsd - expectedCost)).toBeLessThan(0.0001);
        });
    });
});
