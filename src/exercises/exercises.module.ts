import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesResolver } from './exercises.resolver';

import { ExercisesLoader } from './exercises.loader';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [ExercisesResolver, ExercisesService, ExercisesLoader],
    exports: [ExercisesService, ExercisesLoader],
})
export class ExercisesModule { }
