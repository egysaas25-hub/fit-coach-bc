import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateExerciseInput } from './create-exercise.input';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateExerciseInput extends PartialType(CreateExerciseInput) {
    @Field()
    @IsNotEmpty()
    @IsString()
    id: string;
}
