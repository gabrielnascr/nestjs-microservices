import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProxyRMQService } from 'src/proxyrmq/proxyrmq.service';

@Controller('api/v1/rankings')
export class RankingsController {
  constructor(private clientProxy: ProxyRMQService) {}

  private clientRankings = this.clientProxy.ClientProxyRankings();

  @Get()
  find(
    @Query('idCategory') idCategory: string,
    @Query('dateRef') dateRef: string,
  ): Observable<any> {
    if (!idCategory) {
      throw new BadRequestException('Category id is required!');
    }

    return this.clientRankings.send('find-rankings', {
      idCategory: idCategory,
      dateRef: dateRef ? dateRef : '',
    });
  }
}
