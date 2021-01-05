import { Module } from '@nestjs/common';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { ChallengesController } from './challenges.controller';

@Module({
  imports: [ProxyrmqModule],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
