import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchSchema } from './interfaces/match.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Match',
        schema: MatchSchema,
      },
    ]),
    ProxyrmqModule,
  ],
  providers: [MatchService],
  controllers: [MatchController],
})
export class MatchModule {}
