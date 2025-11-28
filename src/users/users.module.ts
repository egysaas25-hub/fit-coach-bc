import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaModule } from '../prisma/prisma.module';

import { UsersLoader } from './users.loader';

@Module({
  imports: [PrismaModule],
  providers: [UsersResolver, UsersService, UsersLoader],
  exports: [UsersService, UsersLoader]
})
export class UsersModule { }
