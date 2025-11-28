import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';

@InputType()
export class WorkflowFilterInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    category?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    trigger?: string;

    @Field(() => Number, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    skip?: number;

    @Field(() => Number, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(1)
    take?: number;
}
