import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(phone: string, otp: string): Promise<User | null> {
        // TODO: Implement actual OTP validation logic here
        // For now, we'll accept a hardcoded OTP '123456' for development
        if (otp !== '123456') {
            return null;
        }

        const user = await this.usersService.findOneByPhone(phone);
        if (user && user.active) {
            return user;
        }
        return null;
    }

    async login(user: User) {
        const payload = { username: user.phone, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
}
