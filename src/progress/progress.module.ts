import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressResolver } from './progress.resolver';

@Module({
    providers: [ProgressResolver, ProgressService],
    exports: [ProgressService],
})
export class ProgressModule { }
