import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { role as RoleEnum } from '@prisma/client';

registerEnumType(RoleEnum, {
    name: 'Role',
});

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field()
    email: string;

    @Field()
    fullName: string;

    @Field(() => RoleEnum)
    role: RoleEnum;

    @Field({ nullable: true })
    phone?: string;

    @Field()
    active: boolean;

    @Field()
    createdAt: Date;
}
