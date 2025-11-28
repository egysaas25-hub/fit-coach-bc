import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

@InputType()
export class ExerciseFilterInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    search?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    muscleGroupId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    trainingTypeId?: string;

    @Field(() => Number, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    skip?: number;

    @Field(() => Number, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(1)
    take?: number;
}
