import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsJSON } from 'class-validator';

@InputType()
export class CreateWorkflowInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    tenantId: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    trigger: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    actions: string; // JSON string

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    category?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @Field()
    @IsNotEmpty()
    @IsString()
    createdBy: string;
}
