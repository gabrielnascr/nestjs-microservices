import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { PlayersModule } from './modules/players/players.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { ProxyRMQService } from './proxyrmq/proxyrmq.service';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { RankingsModule } from './modules/rankings/rankings.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    CategoriesModule,
    PlayersModule,
    ProxyrmqModule,
    ChallengesModule,
    RankingsModule,
    AwsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  providers: [ProxyRMQService],
})
export class AppModule {}
