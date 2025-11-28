import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

@InputType()
export class CustomerFilterInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    search?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    status?: string;

    @Field(() => Int, { nullable: true, defaultValue: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    skip?: number;

    @Field(() => Int, { nullable: true, defaultValue: 20 })
    @IsOptional()
    @IsInt()
    @Min(1)
    take?: number;
}
