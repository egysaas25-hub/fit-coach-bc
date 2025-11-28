import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateProgressEntryInput } from './create-progress-entry.input';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateProgressEntryInput extends PartialType(CreateProgressEntryInput) {
    @Field()
    @IsNotEmpty()
    @IsString()
    id: string;
}
