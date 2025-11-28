import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

export interface GenerateNutritionPlanParams {
    customerId: string;
    tenantId: string;
    caloriesTarget?: number;
    dietaryRestrictions?: string[];
    goalType?: string;
    mealsPerDay?: number;
    userId?: string;
}

export interface NutritionPlanResult {
    meals: Array<{
        mealName: string;
        orderIndex: number;
        items: Array<{
            foodName: string;
            portionSize: string;
            calories: number;
            proteinG: number;
            carbsG: number;
            fatG: number;
            fiberG?: number;
        }>;
    }>;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
}

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);

    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
    ) { }

    async generateNutritionPlan(
        params: GenerateNutritionPlanParams,
    ): Promise<NutritionPlanResult> {
        const startTime = Date.now();
        let success = true;
        let errorMessage: string | undefined;
        let tokensUsed = 0;
        let response: any = null;
        let prompt = '';

        try {
            // Build prompt for AI nutrition generation
            prompt = this.buildNutritionPrompt(params);

            // Simulate AI generation (replace with actual OpenAI/Anthropic call)
            // For now, generate a mock nutrition plan
            const result = await this.mockGenerateNutrition(params);

            response = result;
            tokensUsed = this.estimateTokens(prompt + JSON.stringify(result));

            return result;
        } catch (error) {
            success = false;
            errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`AI nutrition generation failed: ${errorMessage}`);
            throw error;
        } finally {
            // Log the AI generation attempt
            await this.logGeneration({
                tenantId: params.tenantId,
                generatedBy: params.userId ? BigInt(params.userId) : null,
                generationType: 'nutrition_plan',
                prompt,
                parameters: params,
                response,
                tokensUsed,
                costUsd: this.calculateCost(tokensUsed),
                success,
                errorMessage,
            });
        }
    }

    private buildNutritionPrompt(params: GenerateNutritionPlanParams): string {
        const {
            caloriesTarget = 2000,
            dietaryRestrictions = [],
            goalType = 'maintenance',
            mealsPerDay = 3,
        } = params;

        return `Generate a ${mealsPerDay}-meal nutrition plan with approximately ${caloriesTarget} calories.
Goal: ${goalType}
Dietary restrictions: ${dietaryRestrictions.join(', ') || 'None'}

Format the response as JSON with meals containing food items with their macronutrients.`;
    }

    private async mockGenerateNutrition(
        params: GenerateNutritionPlanParams,
    ): Promise<NutritionPlanResult> {
        // Mock implementation - replace with actual AI API call
        const mealsPerDay = params.mealsPerDay || 3;
        const caloriesPerMeal = (params.caloriesTarget || 2000) / mealsPerDay;

        const mealNames = ['Breakfast', 'Lunch', 'Dinner', 'Snack 1', 'Snack 2'];
        const meals = Array.from({ length: mealsPerDay }, (_, i) => ({
            mealName: mealNames[i],
            orderIndex: i,
            items: [
                {
                    foodName: 'Grilled Chicken',
                    portionSize: '150g',
                    calories: Math.round(caloriesPerMeal * 0.4),
                    proteinG: 30,
                    carbsG: 0,
                    fatG: 5,
                    fiberG: 0,
                },
                {
                    foodName: 'Brown Rice',
                    portionSize: '100g',
                    calories: Math.round(caloriesPerMeal * 0.4),
                    proteinG: 5,
                    carbsG: 45,
                    fatG: 2,
                    fiberG: 3,
                },
                {
                    foodName: 'Mixed Vegetables',
                    portionSize: '150g',
                    calories: Math.round(caloriesPerMeal * 0.2),
                    proteinG: 3,
                    carbsG: 10,
                    fatG: 1,
                    fiberG: 4,
                },
            ],
        }));

        const totalCalories = meals.reduce(
            (sum, meal) =>
                sum + meal.items.reduce((mealSum, item) => mealSum + item.calories, 0),
            0,
        );
        const totalProtein = meals.reduce(
            (sum, meal) =>
                sum + meal.items.reduce((mealSum, item) => mealSum + item.proteinG, 0),
            0,
        );
        const totalCarbs = meals.reduce(
            (sum, meal) =>
                sum + meal.items.reduce((mealSum, item) => mealSum + item.carbsG, 0),
            0,
        );
        const totalFat = meals.reduce(
            (sum, meal) =>
                sum + meal.items.reduce((mealSum, item) => mealSum + item.fatG, 0),
            0,
        );

        return {
            meals,
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFat,
        };
    }

    private estimateTokens(text: string): number {
        // Rough estimation: ~4 characters per token
        return Math.ceil(text.length / 4);
    }

    private calculateCost(tokens: number): number {
        // Estimate cost based on token usage (e.g., $0.002 per 1K tokens)
        return (tokens / 1000) * 0.002;
    }

    private async logGeneration(data: {
        tenantId: string;
        generatedBy: bigint | null;
        generationType: string;
        prompt: string;
        parameters: any;
        response: any;
        tokensUsed: number;
        costUsd: number;
        success: boolean;
        errorMessage?: string;
    }): Promise<void> {
        try {
            await this.prisma.ai_generation_logs.create({
                data: {
                    tenant_id: BigInt(data.tenantId),
                    generated_by: data.generatedBy,
                    generation_type: data.generationType,
                    prompt: data.prompt,
                    parameters: data.parameters,
                    response: data.response,
                    tokens_used: data.tokensUsed,
                    cost_usd: data.costUsd,
                    success: data.success,
                    error_message: data.errorMessage,
                },
            });
        } catch (error) {
            this.logger.error(`Failed to log AI generation: ${error}`);
        }
    }
}
