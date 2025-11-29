import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingInput, UpdateBrandingInput } from './dto/update-settings.input';
import { SystemSettings, TenantBranding } from './entities/settings.entity';

@Injectable()
export class SettingsService {
    constructor(private readonly prisma: PrismaService) { }

    async getSettings(tenantId: string): Promise<SystemSettings[]> {
        const settings = await this.prisma.system_settings.findMany({
            where: { tenant_id: BigInt(tenantId) },
            orderBy: { category: 'asc' },
        });

        return settings.map((setting) => this.mapToSystemSettings(setting));
    }

    async getSetting(tenantId: string, category: string): Promise<SystemSettings | null> {
        const setting = await this.prisma.system_settings.findUnique({
            where: {
                tenant_id_category: {
                    tenant_id: BigInt(tenantId),
                    category,
                },
            },
        });

        return setting ? this.mapToSystemSettings(setting) : null;
    }

    async updateSetting(input: UpdateSettingInput): Promise<SystemSettings> {
        const setting = await this.prisma.system_settings.upsert({
            where: {
                tenant_id_category: {
                    tenant_id: BigInt(input.tenantId),
                    category: input.settingKey,
                },
            },
            create: {
                tenant_id: BigInt(input.tenantId),
                category: input.settingKey,
                settings: JSON.parse(input.settingValue),
                updated_by: BigInt('1'), // TODO: Get from context
            },
            update: {
                settings: JSON.parse(input.settingValue),
                updated_by: BigInt('1'), // TODO: Get from context
            },
        });

        return this.mapToSystemSettings(setting);
    }

    async getBranding(tenantId: string): Promise<TenantBranding | null> {
        const branding = await this.prisma.tenant_branding.findFirst({
            where: { tenant_id: BigInt(tenantId) },
        });

        return branding ? this.mapToTenantBranding(branding) : null;
    }

    async updateBranding(input: UpdateBrandingInput): Promise<TenantBranding> {
        const existing = await this.prisma.tenant_branding.findFirst({
            where: { tenant_id: BigInt(input.tenantId) },
        });

        let branding;
        if (existing) {
            branding = await this.prisma.tenant_branding.update({
                where: { id: existing.id },
                data: {
                    logo_url: input.logoUrl,
                    primary_color: input.primaryColor,
                    whatsapp_number: input.customDomain, // Reusing for custom domain
                },
            });
        } else {
            branding = await this.prisma.tenant_branding.create({
                data: {
                    tenant_id: BigInt(input.tenantId),
                    logo_url: input.logoUrl,
                    primary_color: input.primaryColor,
                    whatsapp_number: input.customDomain,
                },
            });
        }

        return this.mapToTenantBranding(branding);
    }

    private mapToSystemSettings(setting: any): SystemSettings {
        return {
            id: setting.id.toString(),
            tenantId: setting.tenant_id.toString(),
            settingKey: setting.category,
            settingValue: JSON.stringify(setting.settings),
            description: undefined,
            createdAt: setting.created_at,
            updatedAt: setting.updated_at,
        };
    }

    private mapToTenantBranding(branding: any): TenantBranding {
        return {
            id: branding.id.toString(),
            tenantId: branding.tenant_id.toString(),
            logoUrl: branding.logo_url,
            primaryColor: branding.primary_color,
            secondaryColor: undefined, // Not in schema
            customDomain: branding.whatsapp_number, // Repurposed
            createdAt: branding.created_at,
            updatedAt: branding.updated_at,
        };
    }
}
