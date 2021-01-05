import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Player } from '../players/interfaces/player.interface';
import { ProxyRMQService } from 'src/proxyrmq/proxyrmq.service';
import { ChallengeStatus } from './challenge-status.enum';
import { AddChallengeMatchDto } from './dtos/add-challenge-match.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { Match } from './interfaces/match.interface';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private clientProxy: ProxyRMQService) {}

  private clientAdminBackend = this.clientProxy.ClientProxyAdminBackend();
  private clientChallenge = this.clientProxy.ClientProxyChallenge();

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createChallengeDto: CreateChallengeDto): Promise<any> {
    const players: Player[] = await this.clientAdminBackend
      .send('find-players', '')
      .toPromise();

    createChallengeDto.players.map(playerDto => {
      const playerFilter: Player[] = players.filter(
        player => player._id == playerDto._id,
      );

      if (playerFilter.length == 0) {
        throw new BadRequestException(`Id ${playerDto._id} is not a player`);
      }

      if (playerFilter[0].category != createChallengeDto.category) {
        throw new BadRequestException(
          `Player ${playerFilter[0]._id} is not part of the category`,
        );
      }
    });

    const requesterIsPlayerTheMatch: Player[] = createChallengeDto.players.filter(
      player => player._id == createChallengeDto.requester,
    );

    if (requesterIsPlayerTheMatch.length == 0) {
      throw new BadRequestException(
        'The requester must be a player of the match!',
      );
    }
    const category = await this.clientAdminBackend
      .send('find-category', createChallengeDto.category)
      .toPromise();

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    this.clientChallenge.emit('create-challenge', createChallengeDto);
  }

  // @Get()
  // async findAll(): Promise<any> {
  //   return this.clientChallenge.send('find-challenge', '')
  // }

  @Get()
  async findByPlayer(@Query('idPlayer') id: string): Promise<any> {
    if (id) {
      const player: Player = await this.clientAdminBackend
        .send('find-players', id)
        .toPromise();
      if (!player) {
        throw new BadRequestException('Player not found');
      }
    }

    return await this.clientChallenge
      .send('find-challenge', { idPlayer: id, id: '' })
      .toPromise();
  }

  @Put(':challenge')
  async update(
    @Body() updateChallengeDto: UpdateChallengeDto,
    @Param('challenge') id: string,
  ): Promise<any> {
    const challenge: Challenge = await this.clientChallenge
      .send('find-challenge', { idPlayer: '', id: id })
      .toPromise();

    if (!challenge) {
      throw new BadRequestException('Challenge not found');
    }

    if (challenge.status != ChallengeStatus.PENDING) {
      throw new BadRequestException(
        'Only PENDING status challenges can be upgraded!',
      );
    }

    console.log(updateChallengeDto);
    await this.clientChallenge
      .emit('update-challenge', { id: id, challenge: updateChallengeDto })
      .toPromise();
  }

  @Post(':challenge/match')
  async addChallengeMatch(
    @Param('challenge') id: string,
    @Body() addChallengeMatchDto: AddChallengeMatchDto,
  ): Promise<any> {
    const challenge: Challenge = await this.clientChallenge
      .send('find-challenge', { idPlayer: '', id: id })
      .toPromise();

    if (!challenge) {
      throw new BadRequestException('Challenge not found');
    }

    if (challenge.status == ChallengeStatus.REALIZED) {
      throw new BadRequestException('Challenge has been realized');
    }

    if (challenge.status != ChallengeStatus.ACCEPTED) {
      throw new BadRequestException('The challenge must be accepted');
    }

    if (!challenge.players.includes(addChallengeMatchDto.def)) {
      throw new BadRequestException('');
    }

    const match: Match = {};

    match.category = challenge.category;
    match.def = addChallengeMatchDto.def;
    match.challenge = id;
    match.players = challenge.players;
    match.result = addChallengeMatchDto.result;

    await this.clientChallenge.emit('create-match', match).toPromise();
  }

  @Delete(':challenge')
  async delete(@Param('id') id: string): Promise<any> {
    const challenge: Challenge = await this.clientChallenge
      .send('find-challenge', id)
      .toPromise();

    if (!challenge) {
      throw new BadRequestException('Challenge not found');
    }

    await this.clientChallenge.send('delete-challenge', '').toPromise();
  }
}
