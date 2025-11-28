import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AutomationService, WorkflowExecutionResult } from './automation.service';
import { Workflow } from './entities/workflow.entity';
import { CreateWorkflowInput } from './dto/create-workflow.input';
import { UpdateWorkflowInput } from './dto/update-workflow.input';
import { WorkflowFilterInput } from './dto/workflow-filter.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
class ExecutionResult {
    @Field()
    success: boolean;

    @Field(() => Int)
    actionsExecuted: number;

    @Field(() => [String], { nullable: true })
    errors?: string[];
}

@Resolver(() => Workflow)
@UseGuards(JwtAuthGuard)
export class AutomationResolver {
    constructor(private readonly automationService: AutomationService) { }

    @Query(() => [Workflow], { name: 'workflows' })
    findAll(@Args('filter', { nullable: true }) filter?: WorkflowFilterInput) {
        const where: any = {};

        if (filter?.category) {
            where.category = filter.category;
        }

        if (filter?.isActive !== undefined) {
            where.is_active = filter.isActive;
        }

        if (filter?.trigger) {
            where.trigger = filter.trigger;
        }

        return this.automationService.findAll({
            skip: filter?.skip,
            take: filter?.take,
            where,
        });
    }

    @Query(() => Workflow, { name: 'workflow', nullable: true })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.automationService.findOne(id);
    }

    @Mutation(() => Workflow)
    createWorkflow(@Args('input') input: CreateWorkflowInput) {
        return this.automationService.create(input);
    }

    @Mutation(() => Workflow)
    updateWorkflow(@Args('input') input: UpdateWorkflowInput) {
        return this.automationService.update(input.id, input);
    }

    @Mutation(() => Workflow)
    deleteWorkflow(@Args('id', { type: () => String }) id: string) {
        return this.automationService.remove(id);
    }

    @Mutation(() => ExecutionResult)
    async executeWorkflow(@Args('id', { type: () => String }) id: string) {
        return this.automationService.executeWorkflow(id);
    }
}
