import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { WorkoutExercise } from './workout-exercise.entity';
import { Customer } from '../../customers/entities/customer.entity';

@ObjectType()
export class Workout {
    @Field(() => ID)
    id: string;

    @Field()
    tenantId: string;

    @Field()
    customerId: string;

    @Field(() => Int)
    version: number;

    @Field()
    isActive: boolean;

    @Field({ nullable: true })
    split?: string;

    @Field({ nullable: true })
    notes?: string;

    @Field()
    createdBy: string;

    @Field()
    createdAt: Date;

    @Field(() => [WorkoutExercise], { nullable: true })
    exercises?: WorkoutExercise[];

    @Field(() => Customer, { nullable: true })
    customer?: Customer;
}
