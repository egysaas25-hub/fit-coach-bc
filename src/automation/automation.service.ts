import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkflowInput } from './dto/create-workflow.input';
import { UpdateWorkflowInput } from './dto/update-workflow.input';
import { Workflow } from './entities/workflow.entity';
import { Prisma } from '@prisma/client';

export interface WorkflowExecutionResult {
    success: boolean;
    actionsExecuted: number;
    errors?: string[];
}

@Injectable()
export class AutomationService {
    private readonly logger = new Logger(AutomationService.name);

    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateWorkflowInput): Promise<Workflow> {
        const workflow = await this.prisma.automation_workflows.create({
            data: {
                tenant_id: BigInt(data.tenantId),
                name: data.name,
                description: data.description,
                trigger: data.trigger,
                actions: JSON.parse(data.actions),
                category: data.category,
                is_active: data.isActive ?? true,
                created_by: BigInt(data.createdBy),
            },
        });
        return this.mapToWorkflow(workflow);
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.automation_workflowsWhereInput;
    }): Promise<Workflow[]> {
        const workflows = await this.prisma.automation_workflows.findMany({
            skip: params.skip,
            take: params.take,
            where: params.where,
            orderBy: { created_at: 'desc' },
        });
        return workflows.map((w) => this.mapToWorkflow(w));
    }

    async findOne(id: string): Promise<Workflow | null> {
        const workflow = await this.prisma.automation_workflows.findUnique({
            where: { id: BigInt(id) },
        });
        return workflow ? this.mapToWorkflow(workflow) : null;
    }

    async update(id: string, data: UpdateWorkflowInput): Promise<Workflow> {
        const updateData: Prisma.automation_workflowsUpdateInput = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.trigger !== undefined) updateData.trigger = data.trigger;
        if (data.actions !== undefined) updateData.actions = JSON.parse(data.actions);
        if (data.category !== undefined) updateData.category = data.category;
        if (data.isActive !== undefined) updateData.is_active = data.isActive;

        const workflow = await this.prisma.automation_workflows.update({
            where: { id: BigInt(id) },
            data: updateData,
        });
        return this.mapToWorkflow(workflow);
    }

    async remove(id: string): Promise<Workflow> {
        const workflow = await this.prisma.automation_workflows.delete({
            where: { id: BigInt(id) },
        });
        return this.mapToWorkflow(workflow);
    }

    async executeWorkflow(id: string): Promise<WorkflowExecutionResult> {
        const workflow = await this.prisma.automation_workflows.findUnique({
            where: { id: BigInt(id) },
        });

        if (!workflow || !workflow.is_active) {
            return {
                success: false,
                actionsExecuted: 0,
                errors: ['Workflow not found or inactive'],
            };
        }

        try {
            const actions = workflow.actions as any[];
            let actionsExecuted = 0;
            const errors: string[] = [];

            // Execute actions sequentially
            for (const action of actions) {
                try {
                    await this.executeAction(action);
                    actionsExecuted++;
                } catch (error) {
                    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                    errors.push(`Action ${action.type} failed: ${errorMsg}`);
                    this.logger.error(`Workflow ${id} action failed:`, error);
                }
            }

            const success = errors.length === 0;
            const totalExecutions = workflow.executions + 1;
            const successfulExecutions = success
                ? (workflow.success_rate * workflow.executions + 1)
                : workflow.success_rate * workflow.executions;
            const newSuccessRate = successfulExecutions / totalExecutions;

            // Update workflow statistics
            await this.prisma.automation_workflows.update({
                where: { id: BigInt(id) },
                data: {
                    executions: totalExecutions,
                    success_rate: newSuccessRate,
                    last_run_at: new Date(),
                },
            });

            return {
                success,
                actionsExecuted,
                errors: errors.length > 0 ? errors : undefined,
            };
        } catch (error) {
            this.logger.error(`Workflow ${id} execution failed:`, error);
            return {
                success: false,
                actionsExecuted: 0,
                errors: [error instanceof Error ? error.message : 'Execution failed'],
            };
        }
    }

    private async executeAction(action: any): Promise<void> {
        // Mock implementation - replace with actual action execution logic
        this.logger.log(`Executing action: ${action.type}`);

        // Simulate action execution
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Property: Actions execute sequentially
        // Each action must complete before the next one starts
    }

    private mapToWorkflow(workflow: any): Workflow {
        return {
            id: workflow.id.toString(),
            tenantId: workflow.tenant_id.toString(),
            name: workflow.name,
            description: workflow.description,
            trigger: workflow.trigger,
            actions: JSON.stringify(workflow.actions),
            category: workflow.category,
            isActive: workflow.is_active,
            executions: workflow.executions,
            successRate: workflow.success_rate,
            lastRunAt: workflow.last_run_at,
            createdBy: workflow.created_by.toString(),
            createdAt: workflow.created_at,
            updatedAt: workflow.updated_at,
        };
    }
}
