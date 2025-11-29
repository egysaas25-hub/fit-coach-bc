import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SignedUrlResponse {
    @Field(() => String, { description: 'The URL to upload the file to (valid for 15 minutes)' })
    uploadUrl: string;

    @Field(() => String, { description: 'The public URL where the file will be accessible after upload' })
    publicUrl: string;

    @Field(() => String, { description: 'The internal storage path of the file' })
    path: string;
}
