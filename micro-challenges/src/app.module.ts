import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengesModule } from './challenges/challenges.module';
import { MatchModule } from './match/match.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:gabriel123@cluster0.6we4v.mongodb.net/microchallenges?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    ),
    ChallengesModule,
    MatchModule,
    ProxyrmqModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
