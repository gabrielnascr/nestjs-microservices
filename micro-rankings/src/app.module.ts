import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { RankingsModule } from './rankings/rankings.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:gabriel123@cluster0.6we4v.mongodb.net/srrankings?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    ),
    ProxyrmqModule,
    RankingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
