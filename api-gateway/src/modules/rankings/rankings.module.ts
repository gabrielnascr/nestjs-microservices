import { Module } from '@nestjs/common';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { RankingsController } from './rankings.controller';

@Module({
  imports: [ProxyrmqModule],
  controllers: [RankingsController],
})
export class RankingsModule {}
