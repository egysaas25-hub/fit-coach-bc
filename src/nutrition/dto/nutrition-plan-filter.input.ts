import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

@InputType()
export class NutritionPlanFilterInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    customerId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    status?: string;

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
