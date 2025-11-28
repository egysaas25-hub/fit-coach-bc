import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';
import { team_members } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOneByPhone(phone: string): Promise<User | null> {
        const user = await this.prisma.team_members.findFirst({
            where: { phone_e164: phone },
        });
        return user ? this.mapToUser(user) : null;
    }

    async findOneById(id: string): Promise<User | null> {
        const user = await this.prisma.team_members.findUnique({
            where: { id: BigInt(id) },
        });
        return user ? this.mapToUser(user) : null;
    }

    async findByIds(ids: string[]): Promise<User[]> {
        const users = await this.prisma.team_members.findMany({
            where: { id: { in: ids.map(id => BigInt(id)) } },
        });
        return users.map(user => this.mapToUser(user));
    }

    private mapToUser(teamMember: team_members): User {
        return {
            id: teamMember.id.toString(),
            email: teamMember.email,
            fullName: teamMember.full_name,
            role: teamMember.role,
            phone: teamMember.phone_e164 || undefined,
            active: teamMember.active,
            createdAt: teamMember.created_at,
        };
    }
}
