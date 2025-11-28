import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum MessageDirection {
    INBOUND = 'inbound',
    OUTBOUND = 'outbound',
}

registerEnumType(MessageDirection, {
    name: 'MessageDirection',
});

@ObjectType()
export class Message {
    @Field(() => ID)
    id: string;

    @Field()
    tenantId: string;

    @Field({ nullable: true })
    conversationId?: string;

    @Field()
    customerId: string;

    @Field(() => MessageDirection)
    direction: MessageDirection;

    @Field({ nullable: true })
    text?: string;

    @Field(() => String, { nullable: true })
    meta?: string;

    @Field()
    timestamp: Date;

    @Field({ nullable: true })
    status?: string;
}
