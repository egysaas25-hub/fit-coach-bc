import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionInput, UpdateSubscriptionInput } from './dto/subscription.input';
import { Subscription, SubscriptionStatus } from './entities/subscription.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(input: CreateSubscriptionInput): Promise<Subscription> {
        const startAt = input.startAt ? new Date(input.startAt) : new Date();

        // Calculate renew date (30 days from start)
        const renewAt = new Date(startAt);
        renewAt.setDate(renewAt.getDate() + 30);

        // Calculate USD amount and FX rate
        const amountUsd = this.calculateUsdAmount(input.priceCents);
        const fxRate = 1.0; // Default to 1:1, should be fetched from currency service

        const subscription = await this.prisma.subscriptions.create({
            data: {
                tenant_id: BigInt(input.tenantId),
                customer_id: BigInt(input.customerId),
                plan_code: input.planCode,
                price_cents: input.priceCents,
                currency_id: BigInt(input.currencyId),
                amount_usd: amountUsd,
                fx_rate: fxRate,
                status: 'active',
                start_at: startAt,
                renew_at: renewAt,
                sales_owner_id: input.salesOwnerId ? BigInt(input.salesOwnerId) : null,
                coach_owner_id: input.coachOwnerId ? BigInt(input.coachOwnerId) : null,
            },
        });

        return this.mapToSubscription(subscription);
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.subscriptionsWhereInput;
    }): Promise<Subscription[]> {
        const subscriptions = await this.prisma.subscriptions.findMany({
            skip: params.skip,
            take: params.take,
            where: params.where,
            orderBy: { created_at: 'desc' },
        });

        return subscriptions.map((sub) => this.mapToSubscription(sub));
    }

    async findOne(id: string): Promise<Subscription | null> {
        const subscription = await this.prisma.subscriptions.findUnique({
            where: { id: BigInt(id) },
        });

        return subscription ? this.mapToSubscription(subscription) : null;
    }

    async update(input: UpdateSubscriptionInput): Promise<Subscription> {
        const data: Prisma.subscriptionsUpdateInput = {};

        if (input.status !== undefined) {
            data.status = input.status as any; // Cast to avoid enum mismatch
        }

        if (input.renewAt !== undefined) {
            data.renew_at = new Date(input.renewAt);
        }

        if (input.cancelAt !== undefined) {
            data.cancel_at = new Date(input.cancelAt);
        }

        const subscription = await this.prisma.subscriptions.update({
            where: { id: BigInt(input.id) },
            data,
        });

        return this.mapToSubscription(subscription);
    }

    async cancel(id: string): Promise<Subscription> {
        const subscription = await this.prisma.subscriptions.update({
            where: { id: BigInt(id) },
            data: {
                status: 'cancelled',
                cancel_at: new Date(),
            },
        });

        return this.mapToSubscription(subscription);
    }

    // Property: Billing calculation accuracy
    private calculateUsdAmount(priceCents: number): number {
        return Number((priceCents / 100).toFixed(2));
    }

    // Property: Access control based on subscription status
    hasActiveSubscription(subscription: Subscription): boolean {
        return subscription.status === SubscriptionStatus.ACTIVE;
    }

    private mapToSubscription(sub: any): Subscription {
        return {
            id: sub.id.toString(),
            tenantId: sub.tenant_id.toString(),
            customerId: sub.customer_id.toString(),
            planCode: sub.plan_code,
            priceCents: sub.price_cents,
            currencyId: sub.currency_id.toString(),
            amountUsd: sub.amount_usd ? Number(sub.amount_usd) : undefined,
            fxRate: sub.fx_rate ? Number(sub.fx_rate) : undefined,
            status: sub.status as SubscriptionStatus,
            startAt: sub.start_at,
            renewAt: sub.renew_at,
            cancelAt: sub.cancel_at,
            salesOwnerId: sub.sales_owner_id?.toString(),
            coachOwnerId: sub.coach_owner_id?.toString(),
            rotationPriority: sub.rotation_priority,
            createdAt: sub.created_at,
            updatedAt: sub.updated_at,
        };
    }
}
