import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsDateString, IsString } from 'class-validator';

@InputType()
export class DateRangeInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    tenantId?: string;
}
