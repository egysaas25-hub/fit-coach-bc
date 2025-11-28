import { Module } from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { NutritionResolver } from './nutrition.resolver';
import { AiModule } from '../ai/ai.module';

@Module({
    imports: [AiModule],
    providers: [NutritionResolver, NutritionService],
    exports: [NutritionService],
})
export class NutritionModule { }
