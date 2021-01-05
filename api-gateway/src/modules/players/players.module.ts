import { Module } from '@nestjs/common';
import { AwsModule } from 'src/aws/aws.module';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { PlayersController } from './players.controller';

@Module({
  imports: [ProxyrmqModule, AwsModule],
  controllers: [PlayersController],
})
export class PlayersModule {}
