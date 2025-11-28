import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateWorkflowInput } from './create-workflow.input';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateWorkflowInput extends PartialType(CreateWorkflowInput) {
    @Field()
    @IsNotEmpty()
    @IsString()
    id: string;
}
