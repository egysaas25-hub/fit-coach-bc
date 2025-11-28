import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Message } from './message.entity';

@ObjectType()
export class Conversation {
    @Field(() => ID)
    id: string;

    @Field()
    tenantId: string;

    @Field()
    customerId: string;

    @Field()
    channel: string;

    @Field()
    startedAt: Date;

    @Field()
    lastActivityAt: Date;

    @Field(() => [Message], { nullable: true })
    messages?: Message[];
}
