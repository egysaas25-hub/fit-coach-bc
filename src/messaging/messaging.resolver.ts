import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { SendMessageInput } from './dto/send-message.input';
import { ConversationFilterInput } from './dto/conversation-filter.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Conversation)
@UseGuards(JwtAuthGuard)
export class MessagingResolver {
    constructor(private readonly messagingService: MessagingService) { }

    @Query(() => [Conversation], { name: 'conversations' })
    findAllConversations(
        @Args('filter', { nullable: true }) filter?: ConversationFilterInput,
    ) {
        const where: any = {};

        if (filter?.customerId) {
            where.customer_id = BigInt(filter.customerId);
        }

        if (filter?.channel) {
            where.channel = filter.channel;
        }

        if (filter?.startDate || filter?.endDate) {
            where.last_activity_at = {};
            if (filter.startDate) {
                where.last_activity_at.gte = new Date(filter.startDate);
            }
            if (filter.endDate) {
                where.last_activity_at.lte = new Date(filter.endDate);
            }
        }

        return this.messagingService.findAllConversations({
            skip: filter?.skip,
            take: filter?.take,
            where,
        });
    }

    @Query(() => Conversation, { name: 'conversation', nullable: true })
    findConversation(@Args('id', { type: () => String }) id: string) {
        return this.messagingService.findConversation(id);
    }

    @Query(() => [Message], { name: 'messages' })
    findMessages(@Args('conversationId', { type: () => String }) conversationId: string) {
        return this.messagingService.findMessagesByConversation(conversationId);
    }

    @Mutation(() => Message)
    sendMessage(@Args('input') input: SendMessageInput) {
        return this.messagingService.sendMessage(input);
    }
}
