import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max, IsBoolean, IsInt, IsDateString } from 'class-validator';

@InputType()
export class CreateProgressEntryInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    tenantId: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    customerId: string;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1000) // Max weight in kg
    weightKg?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    workoutDone?: boolean;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(24)
    sleepHours?: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(10) // Pain score 0-10
    painScore?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    notes?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    recordedAt?: string;
}
