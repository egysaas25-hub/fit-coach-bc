import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class SystemSettings {
    @Field(() => ID)
    id: string;

    @Field()
    tenantId: string;

    @Field()
    settingKey: string;

    @Field()
    settingValue: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

@ObjectType()
export class TenantBranding {
    @Field(() => ID)
    id: string;

    @Field()
    tenantId: string;

    @Field({ nullable: true })
    logoUrl?: string;

    @Field({ nullable: true })
    primaryColor?: string;

    @Field({ nullable: true })
    secondaryColor?: string;

    @Field({ nullable: true })
    customDomain?: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
