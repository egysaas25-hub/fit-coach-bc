import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsInt, Min, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { SubscriptionStatus } from '../entities/subscription.entity';

@InputType()
export class CreateSubscriptionInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    tenantId: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    customerId: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    planCode: string;

    @Field(() => Int)
    @IsInt()
    @Min(0)
    priceCents: number;

    @Field()
    @IsNotEmpty()
    @IsString()
    currencyId: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    startAt?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    salesOwnerId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    coachOwnerId?: string;
}

@InputType()
export class UpdateSubscriptionInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    id: string;

    @Field(() => SubscriptionStatus, { nullable: true })
    @IsOptional()
    @IsEnum(SubscriptionStatus)
    status?: SubscriptionStatus;

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    renewAt?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    cancelAt?: string;
}
