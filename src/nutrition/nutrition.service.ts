import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNutritionPlanInput } from './dto/create-nutrition-plan.input';
import { UpdateNutritionPlanInput } from './dto/update-nutrition-plan.input';
import { NutritionPlan } from './entities/nutrition-plan.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class NutritionService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateNutritionPlanInput): Promise<NutritionPlan> {
        const plan = await this.prisma.nutrition_plans.create({
            data: {
                tenant_id: BigInt(data.tenantId),
                customer_id: BigInt(data.customerId),
                version: 1, // Default version
                is_active: data.isActive ?? true,
                calories_target: data.caloriesTarget,
                notes: data.notes,
                status: data.status ?? 'approved',
                created_by: BigInt(1), // TODO: Get from context/auth
                nutrition_meals: data.meals
                    ? {
                        create: data.meals.map((meal) => ({
                            tenant_id: BigInt(data.tenantId),
                            meal_name: meal.mealName,
                            order_index: meal.orderIndex,
                            notes: meal.notes,
                            nutrition_meal_items: meal.items
                                ? {
                                    create: meal.items.map((item) => ({
                                        tenant_id: BigInt(data.tenantId),
                                        food_name: item.foodName,
                                        food_id: item.foodId ? BigInt(item.foodId) : null,
                                        portion_size: item.portionSize,
                                        calories: item.calories,
                                        protein_g: item.proteinG,
                                        carbs_g: item.carbsG,
                                        fat_g: item.fatG,
                                        fiber_g: item.fiberG,
                                        alternatives: item.alternatives ?? Prisma.JsonNull,
                                        order_index: item.orderIndex,
                                    })),
                                }
                                : undefined,
                        })),
                    }
                    : undefined,
            },
            include: {
                nutrition_meals: {
                    include: {
                        nutrition_meal_items: {
                            include: { nutrition_facts: true },
                        },
                    },
                },
            },
        });
        return this.mapToNutritionPlan(plan);
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.nutrition_plansWhereInput;
    }): Promise<NutritionPlan[]> {
        const plans = await this.prisma.nutrition_plans.findMany({
            skip: params.skip,
            take: params.take,
            where: params.where,
            include: {
                nutrition_meals: {
                    include: {
                        nutrition_meal_items: {
                            include: { nutrition_facts: true },
                        },
                    },
                },
            },
        });
        return plans.map((p) => this.mapToNutritionPlan(p));
    }

    async findOne(id: string): Promise<NutritionPlan | null> {
        const plan = await this.prisma.nutrition_plans.findUnique({
            where: { id: BigInt(id) },
            include: {
                nutrition_meals: {
                    include: {
                        nutrition_meal_items: {
                            include: { nutrition_facts: true },
                        },
                    },
                },
            },
        });
        return plan ? this.mapToNutritionPlan(plan) : null;
    }

    async update(id: string, data: UpdateNutritionPlanInput): Promise<NutritionPlan> {
        const existingPlan = await this.prisma.nutrition_plans.findUnique({
            where: { id: BigInt(id) },
        });

        if (!existingPlan) {
            throw new Error(`NutritionPlan with ID ${id} not found`);
        }

        const tenantId = existingPlan.tenant_id;

        const updateData: Prisma.nutrition_plansUpdateInput = {};
        if (data.isActive !== undefined) updateData.is_active = data.isActive;
        if (data.caloriesTarget !== undefined) updateData.calories_target = data.caloriesTarget;
        if (data.notes !== undefined) updateData.notes = data.notes;
        if (data.status !== undefined) updateData.status = data.status;

        // Handle nested updates (replace strategy for simplicity)
        if (data.meals) {
            updateData.nutrition_meals = {
                deleteMany: {},
                create: data.meals.map((meal) => ({
                    tenant_id: tenantId,
                    meal_name: meal.mealName,
                    order_index: meal.orderIndex,
                    notes: meal.notes,
                    nutrition_meal_items: meal.items
                        ? {
                            create: meal.items.map((item) => ({
                                tenant_id: tenantId,
                                food_name: item.foodName,
                                food_id: item.foodId ? BigInt(item.foodId) : null,
                                portion_size: item.portionSize,
                                calories: item.calories,
                                protein_g: item.proteinG,
                                carbs_g: item.carbsG,
                                fat_g: item.fatG,
                                fiber_g: item.fiberG,
                                alternatives: item.alternatives ?? Prisma.JsonNull,
                                order_index: item.orderIndex,
                            })),
                        }
                        : undefined,
                })),
            };
        }

        const plan = await this.prisma.nutrition_plans.update({
            where: { id: BigInt(id) },
            data: updateData,
            include: {
                nutrition_meals: {
                    include: {
                        nutrition_meal_items: {
                            include: { nutrition_facts: true },
                        },
                    },
                },
            },
        });
        return this.mapToNutritionPlan(plan);
    }

    async remove(id: string): Promise<NutritionPlan> {
        const plan = await this.prisma.nutrition_plans.delete({
            where: { id: BigInt(id) },
            include: {
                nutrition_meals: {
                    include: {
                        nutrition_meal_items: {
                            include: { nutrition_facts: true },
                        },
                    },
                },
            },
        });
        return this.mapToNutritionPlan(plan);
    }

    private mapToNutritionPlan(plan: any): NutritionPlan {
        return {
            id: plan.id.toString(),
            tenantId: plan.tenant_id.toString(),
            customerId: plan.customer_id.toString(),
            version: plan.version,
            isActive: plan.is_active,
            caloriesTarget: plan.calories_target,
            notes: plan.notes,
            createdBy: plan.created_by.toString(),
            createdAt: plan.created_at,
            status: plan.status,
            meals: plan.nutrition_meals?.map((meal: any) => ({
                id: meal.id.toString(),
                planId: meal.plan_id.toString(),
                mealName: meal.meal_name,
                orderIndex: meal.order_index,
                notes: meal.notes,
                items: meal.nutrition_meal_items?.map((item: any) => ({
                    id: item.id.toString(),
                    mealId: item.meal_id.toString(),
                    foodName: item.food_name,
                    foodId: item.food_id?.toString(),
                    portionSize: item.portion_size,
                    calories: item.calories?.toNumber(),
                    proteinG: item.protein_g?.toNumber(),
                    carbsG: item.carbs_g?.toNumber(),
                    fatG: item.fat_g?.toNumber(),
                    fiberG: item.fiber_g?.toNumber(),
                    alternatives: item.alternatives,
                    orderIndex: item.order_index,
                    food: item.nutrition_facts
                        ? {
                            id: item.nutrition_facts.id.toString(),
                            tenantId: item.nutrition_facts.tenant_id.toString(),
                            foodName: item.nutrition_facts.food_name,
                            portionSize: item.nutrition_facts.portion_size,
                            calories: item.nutrition_facts.calories?.toNumber(),
                            proteinG: item.nutrition_facts.protein_g?.toNumber(),
                            carbsG: item.nutrition_facts.carbs_g?.toNumber(),
                            fatG: item.nutrition_facts.fat_g?.toNumber(),
                            fiberG: item.nutrition_facts.fiber_g?.toNumber(),
                            category: item.nutrition_facts.category,
                        }
                        : undefined,
                })),
            })),
        };
    }
}
