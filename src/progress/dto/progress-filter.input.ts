import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, Min, IsDateString } from 'class-validator';

@InputType()
export class ProgressFilterInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    customerId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    endDate?: string;

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
