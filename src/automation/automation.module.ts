import { Module } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { AutomationResolver } from './automation.resolver';

@Module({
    providers: [AutomationResolver, AutomationService],
    exports: [AutomationService],
})
export class AutomationModule { }
