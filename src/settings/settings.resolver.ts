import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SystemSettings, TenantBranding } from './entities/settings.entity';
import { UpdateSettingInput, UpdateBrandingInput } from './dto/update-settings.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => SystemSettings)
@UseGuards(JwtAuthGuard)
export class SettingsResolver {
    constructor(private readonly settingsService: SettingsService) { }

    @Query(() => [SystemSettings], { name: 'settings' })
    getSettings(@Args('tenantId', { type: () => String }) tenantId: string) {
        return this.settingsService.getSettings(tenantId);
    }

    @Query(() => SystemSettings, { name: 'setting', nullable: true })
    getSetting(
        @Args('tenantId', { type: () => String }) tenantId: string,
        @Args('key', { type: () => String }) key: string,
    ) {
        return this.settingsService.getSetting(tenantId, key);
    }

    @Mutation(() => SystemSettings)
    updateSetting(@Args('input') input: UpdateSettingInput) {
        return this.settingsService.updateSetting(input);
    }

    @Query(() => TenantBranding, { name: 'branding', nullable: true })
    getBranding(@Args('tenantId', { type: () => String }) tenantId: string) {
        return this.settingsService.getBranding(tenantId);
    }

    @Mutation(() => TenantBranding)
    updateBranding(@Args('input') input: UpdateBrandingInput) {
        return this.settingsService.updateBranding(input);
    }
}
