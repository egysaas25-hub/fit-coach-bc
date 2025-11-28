import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class SendMessageInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    tenantId: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    customerId: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    conversationId?: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    text: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    templateId?: string;
}
