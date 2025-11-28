import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response.dto';
import { UnauthorizedException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    @Mutation(() => LoginResponse)
    async login(
        @Args('phone') phone: string,
        @Args('otp') otp: string,
    ): Promise<LoginResponse> {
        const user = await this.authService.validateUser(phone, otp);
        if (!user) {
            throw new UnauthorizedException('Invalid phone number or OTP');
        }
        return this.authService.login(user);
    }
}
