import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageInput } from './dto/send-message.input';
import { Conversation } from './entities/conversation.entity';
import { Message, MessageDirection } from './entities/message.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessagingService {
    constructor(private readonly prisma: PrismaService) { }

    async findAllConversations(params: {
        skip?: number;
        take?: number;
        where?: Prisma.conversationsWhereInput;
    }): Promise<Conversation[]> {
        const conversations = await this.prisma.conversations.findMany({
            skip: params.skip,
            take: params.take,
            where: params.where,
            orderBy: { last_activity_at: 'desc' },
            include: {
                inbound_messages: {
                    orderBy: { received_at: 'asc' },
                    take: 50,
                },
                outbound_messages: {
                    orderBy: { created_at: 'asc' },
                    take: 50,
                },
            },
        });

        return conversations.map((conv) => this.mapToConversation(conv));
    }

    async findConversation(id: string): Promise<Conversation | null> {
        const conversation = await this.prisma.conversations.findUnique({
            where: { id: BigInt(id) },
            include: {
                inbound_messages: {
                    orderBy: { received_at: 'asc' },
                },
                outbound_messages: {
                    orderBy: { created_at: 'asc' },
                },
            },
        });

        return conversation ? this.mapToConversation(conversation) : null;
    }

    async findMessagesByConversation(conversationId: string): Promise<Message[]> {
        const conversation = await this.prisma.conversations.findUnique({
            where: { id: BigInt(conversationId) },
            include: {
                inbound_messages: {
                    orderBy: { received_at: 'asc' },
                },
                outbound_messages: {
                    orderBy: { created_at: 'asc' },
                },
            },
        });

        if (!conversation) {
            return [];
        }

        // Merge and sort messages chronologically
        const messages: Message[] = [];

        conversation.inbound_messages.forEach((msg) => {
            messages.push({
                id: msg.id.toString(),
                tenantId: msg.tenant_id.toString(),
                conversationId: msg.conversation_id?.toString() || undefined,
                customerId: msg.customer_id.toString(),
                direction: MessageDirection.INBOUND,
                text: msg.text || undefined,
                meta: msg.meta ? JSON.stringify(msg.meta) : undefined,
                timestamp: msg.received_at,
                status: undefined,
            });
        });

        conversation.outbound_messages.forEach((msg) => {
            messages.push({
                id: msg.id.toString(),
                tenantId: msg.tenant_id.toString(),
                conversationId: msg.conversation_id?.toString() || undefined,
                customerId: msg.customer_id.toString(),
                direction: MessageDirection.OUTBOUND,
                text: msg.text || undefined,
                meta: undefined,
                timestamp: msg.sent_at || msg.created_at,
                status: msg.status,
            });
        });

        // Sort chronologically
        messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        return messages;
    }

    async sendMessage(data: SendMessageInput): Promise<Message> {
        // Get or create conversation
        let conversationId = data.conversationId ? BigInt(data.conversationId) : null;

        if (!conversationId) {
            // Create new conversation if not exists
            const conversation = await this.prisma.conversations.create({
                data: {
                    tenant_id: BigInt(data.tenantId),
                    customer_id: BigInt(data.customerId),
                    channel: 'wa',
                },
            });
            conversationId = conversation.id;
        }

        // Create outbound message
        const message = await this.prisma.outbound_messages.create({
            data: {
                tenant_id: BigInt(data.tenantId),
                customer_id: BigInt(data.customerId),
                conversation_id: conversationId,
                text: data.text,
                template_id: data.templateId ? BigInt(data.templateId) : undefined,
                status: 'queued',
            },
        });

        // Update conversation last_activity_at
        await this.prisma.conversations.update({
            where: { id: conversationId },
            data: { last_activity_at: new Date() },
        });

        return {
            id: message.id.toString(),
            tenantId: message.tenant_id.toString(),
            conversationId: message.conversation_id?.toString() || undefined,
            customerId: message.customer_id.toString(),
            direction: MessageDirection.OUTBOUND,
            text: message.text || undefined,
            meta: undefined,
            timestamp: message.created_at,
            status: message.status,
        };
    }

    private mapToConversation(conv: any): Conversation {
        const messages: Message[] = [];

        // Add inbound messages
        if (conv.inbound_messages) {
            conv.inbound_messages.forEach((msg: any) => {
                messages.push({
                    id: msg.id.toString(),
                    tenantId: msg.tenant_id.toString(),
                    conversationId: msg.conversation_id?.toString() || undefined,
                    customerId: msg.customer_id.toString(),
                    direction: MessageDirection.INBOUND,
                    text: msg.text || undefined,
                    meta: msg.meta ? JSON.stringify(msg.meta) : undefined,
                    timestamp: msg.received_at,
                    status: undefined,
                });
            });
        }

        // Add outbound messages
        if (conv.outbound_messages) {
            conv.outbound_messages.forEach((msg: any) => {
                messages.push({
                    id: msg.id.toString(),
                    tenantId: msg.tenant_id.toString(),
                    conversationId: msg.conversation_id?.toString() || undefined,
                    customerId: msg.customer_id.toString(),
                    direction: MessageDirection.OUTBOUND,
                    text: msg.text || undefined,
                    meta: undefined,
                    timestamp: msg.sent_at || msg.created_at,
                    status: msg.status,
                });
            });
        }

        // Sort messages chronologically
        messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        return {
            id: conv.id.toString(),
            tenantId: conv.tenant_id.toString(),
            customerId: conv.customer_id.toString(),
            channel: conv.channel,
            startedAt: conv.started_at,
            lastActivityAt: conv.last_activity_at,
            messages,
        };
    }
}
