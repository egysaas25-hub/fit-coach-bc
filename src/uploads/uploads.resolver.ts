import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadsService } from './uploads.service';
import { SignedUrlResponse } from './dto/signed-url.response';

@Resolver()
export class UploadsResolver {
    constructor(private readonly uploadsService: UploadsService) { }

    @Mutation(() => SignedUrlResponse)
    @UseGuards(JwtAuthGuard)
    async getSignedUploadUrl(
        @Args('filename') filename: string,
        @Args('contentType') contentType: string,
        @Args('folder', { nullable: true }) folder?: string,
    ) {
        return this.uploadsService.getSignedUploadUrl(filename, contentType, folder);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    async deleteFile(@Args('path') path: string) {
        return this.uploadsService.deleteFile(path);
    }
}
