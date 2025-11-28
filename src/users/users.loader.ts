import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UsersLoader {
    constructor(private readonly usersService: UsersService) { }

    public readonly batchUsers = new DataLoader<string, User>(async (ids: string[]) => {
        const users = await this.usersService.findByIds(ids);
        const usersMap = new Map(users.map((user) => [user.id, user]));
        return ids.map((id) => usersMap.get(id) || new Error(`User not found: ${id}`));
    });
}
