import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateCustomerInput } from './create-customer.input';
import { IsOptional, IsString, IsEmail } from 'class-validator';

@InputType()
export class UpdateCustomerInput extends PartialType(CreateCustomerInput) {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsEmail()
    email?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    phone?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    status?: string;
}
