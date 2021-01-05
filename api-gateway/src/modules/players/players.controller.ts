/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProxyRMQService } from 'src/proxyrmq/proxyrmq.service';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { AwsService } from '../../aws/aws.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express'

@Controller('api/v1/players')
export class PlayersController {
  constructor(
    private clientProxy: ProxyRMQService,
    private awsService: AwsService,
  ) {}

  private logger = new Logger(PlayersController.name)
  private clientAdminBackend = this.clientProxy.ClientProxyAdminBackend();

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createPlayerDto: CreatePlayerDto): Promise<any> {
    const category = await this.clientAdminBackend
      .send('find-category', createPlayerDto.category)
      .toPromise();

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return await this.clientAdminBackend
      .emit('create-player', createPlayerDto)
      .toPromise();
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Req() req: Request): any {
    this.logger.log(`req: ${JSON.stringify(req.user)}`)
    return this.clientAdminBackend.send('find-players', '');
  }

  @Get(':id')
  find(@Param('id') id: string): any {
    return this.clientAdminBackend.send('find-players', id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<any> {
    const category = await this.clientAdminBackend
      .send('find-categories', updatePlayerDto.category)
      .toPromise();

    if (category) {
      await this.clientAdminBackend
        .emit('update-player', {
          id: id,
          player: updatePlayerDto,
        })
        .toPromise();
    } else {
      throw new BadRequestException('Category not found');
    }
  }

  @Delete(':id')
  delete(@Param('id') id: string): any {
    return this.clientAdminBackend.send('delete-player', id);
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: any,
  ): Promise<any> {
    const player = await this.clientAdminBackend
      .send('find-players', id)
      .toPromise();
    const avatarUrl = await this.awsService.uploadFile(file, id);

    if (!player) {
      throw new BadRequestException('Player not found');
    }

    const updatePlayerDto: UpdatePlayerDto = {};
    updatePlayerDto.avatar = avatarUrl.url;

    await this.clientAdminBackend
      .emit('update-player', { id: id, player: updatePlayerDto })
      .toPromise();
    return this.clientAdminBackend.send('find-players', id);
  }
}
