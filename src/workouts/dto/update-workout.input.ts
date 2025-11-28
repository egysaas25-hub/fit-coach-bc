import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateWorkoutInput } from './create-workout.input';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateWorkoutInput extends PartialType(CreateWorkoutInput) {
    @Field()
    @IsNotEmpty()
    @IsString()
    id: string;
}
