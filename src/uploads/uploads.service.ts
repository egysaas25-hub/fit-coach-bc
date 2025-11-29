import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
    private supabase: SupabaseClient;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const supabaseKey = this.configService.get<string>('SUPABASE_KEY'); // Service Role Key preferred for storage admin
        this.bucketName = this.configService.get<string>('STORAGE_BUCKET') || 'uploads';

        if (!supabaseUrl || !supabaseKey) {
            console.warn('Supabase credentials not found. File uploads will fail.');
        }

        this.supabase = createClient(supabaseUrl || '', supabaseKey || '');
    }

    async getSignedUploadUrl(filename: string, contentType: string, folder: string = 'general') {
        const uniqueFilename = `${uuidv4()}-${filename}`;
        const filePath = `${folder}/${uniqueFilename}`;

        const { data, error } = await this.supabase
            .storage
            .from(this.bucketName)
            .createSignedUploadUrl(filePath);

        if (error) {
            throw new InternalServerErrorException(`Failed to generate upload URL: ${error.message}`);
        }

        // Construct public URL (assuming bucket is public, or we use signed download URLs)
        // For now, let's assume public bucket for simplicity in this phase
        const { data: publicUrlData } = this.supabase
            .storage
            .from(this.bucketName)
            .getPublicUrl(filePath);

        return {
            uploadUrl: data.signedUrl,
            publicUrl: publicUrlData.publicUrl,
            path: filePath,
        };
    }

    async deleteFile(path: string): Promise<boolean> {
        const { data, error } = await this.supabase
            .storage
            .from(this.bucketName)
            .remove([path]);

        if (error) {
            throw new InternalServerErrorException(`Failed to delete file: ${error.message}`);
        }

        return true;
    }
}
