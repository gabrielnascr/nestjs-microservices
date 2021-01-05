import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge } from 'src/challenges/interfaces/challenge.interface';
import { ProxyrmqService } from 'src/proxyrmq/proxyrmq.service';
import { Match } from './interfaces/match.interface';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private clientProxy: ProxyrmqService,
  ) {}

  private readonly logger = new Logger(MatchService.name);

  private clientChallenge = this.clientProxy.ClientProxyChallenge();
  private clientRankings = this.clientProxy.ClientProxyRankings();

  async createMatch(match: Match): Promise<Match> {
    try {
      const matchCreated = new this.matchModel(match);

      const result = await matchCreated.save();
      const idMatch = result._id;

      const challenge: Challenge = await this.clientChallenge
        .send('find-challenge', { idPlayer: '', id: match.challenge })
        .toPromise();

      await this.clientChallenge
        .emit('update-challenge-match', {
          idMatch: idMatch,
          challenge: challenge,
        })
        .toPromise();

      return await this.clientRankings
        .emit('process-match', { idMatch: idMatch, match: match })
        .toPromise();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
