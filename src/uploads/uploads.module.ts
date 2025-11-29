import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadsService } from './uploads.service';
import { UploadsResolver } from './uploads.resolver';

@Module({
    imports: [ConfigModule],
    providers: [UploadsResolver, UploadsService],
    exports: [UploadsService],
})
export class UploadsModule { }
