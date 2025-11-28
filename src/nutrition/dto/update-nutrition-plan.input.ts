import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateNutritionPlanInput } from './create-nutrition-plan.input';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateNutritionPlanInput extends PartialType(CreateNutritionPlanInput) {
    @Field()
    @IsNotEmpty()
    @IsString()
    id: string;
}
