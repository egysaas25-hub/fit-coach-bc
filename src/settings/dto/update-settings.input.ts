import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, Matches, IsUrl } from 'class-validator';

@InputType()
export class UpdateSettingInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    tenantId: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    settingKey: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    settingValue: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;
}

@InputType()
export class UpdateBrandingInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    tenantId: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsUrl()
    logoUrl?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Matches(/^#[0-9A-F]{6}$/i)
    primaryColor?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Matches(/^#[0-9A-F]{6}$/i)
    secondaryColor?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    customDomain?: string;
}
