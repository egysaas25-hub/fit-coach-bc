import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { NutritionPlan } from './entities/nutrition-plan.entity';
import { CreateNutritionPlanInput } from './dto/create-nutrition-plan.input';
import { UpdateNutritionPlanInput } from './dto/update-nutrition-plan.input';
import { NutritionPlanFilterInput } from './dto/nutrition-plan-filter.input';
import { GenerateNutritionPlanInput } from '../ai/dto/generate-nutrition-plan.input';
import { AiService } from '../ai/ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => NutritionPlan)
@UseGuards(JwtAuthGuard)
export class NutritionResolver {
    constructor(
        private readonly nutritionService: NutritionService,
        private readonly aiService: AiService,
    ) { }

    @Query(() => [NutritionPlan], { name: 'nutritionPlans' })
    findAll(@Args('filter', { nullable: true }) filter?: NutritionPlanFilterInput) {
        const where: any = {};
        if (filter?.customerId) {
            where.customer_id = BigInt(filter.customerId);
        }
        if (filter?.status) {
            where.status = filter.status;
        }

        return this.nutritionService.findAll({
            skip: filter?.skip,
            take: filter?.take,
            where,
        });
    }

    @Query(() => NutritionPlan, { name: 'nutritionPlan' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.nutritionService.findOne(id);
    }

    @Mutation(() => NutritionPlan)
    createNutritionPlan(@Args('input') input: CreateNutritionPlanInput) {
        return this.nutritionService.create(input);
    }

    @Mutation(() => NutritionPlan)
    updateNutritionPlan(@Args('input') input: UpdateNutritionPlanInput) {
        return this.nutritionService.update(input.id, input);
    }

    @Mutation(() => NutritionPlan)
    deleteNutritionPlan(@Args('id', { type: () => String }) id: string) {
        return this.nutritionService.remove(id);
    }

    @Mutation(() => NutritionPlan)
    async aiGenerateNutritionPlan(@Args('input') input: GenerateNutritionPlanInput) {
        // Generate nutrition plan using AI
        const aiResult = await this.aiService.generateNutritionPlan({
            customerId: input.customerId,
            tenantId: input.tenantId,
            caloriesTarget: input.caloriesTarget,
            dietaryRestrictions: input.dietaryRestrictions,
            goalType: input.goalType,
            mealsPerDay: input.mealsPerDay,
            userId: '1', // TODO: Get from auth context
        });

        // Create the nutrition plan in the database
        const createInput: CreateNutritionPlanInput = {
            tenantId: input.tenantId,
            customerId: input.customerId,
            caloriesTarget: aiResult.totalCalories,
            isActive: true,
            status: 'approved',
            meals: aiResult.meals.map((meal) => ({
                mealName: meal.mealName,
                orderIndex: meal.orderIndex,
                notes: `AI Generated - Target: ${input.caloriesTarget || 2000} cal`,
                items: meal.items.map((item, idx) => ({
                    foodName: item.foodName,
                    portionSize: item.portionSize,
                    calories: item.calories,
                    proteinG: item.proteinG,
                    carbsG: item.carbsG,
                    fatG: item.fatG,
                    fiberG: item.fiberG,
                    orderIndex: idx,
                })),
            })),
        };

        return this.nutritionService.create(createInput);
    }
}
