import { Module } from '@nestjs/common';
import { ProxyrmqService } from './client-proxy';

@Module({
  providers: [ProxyrmqService],
  exports: [ProxyrmqService],
})
export class ProxyrmqModule {}
