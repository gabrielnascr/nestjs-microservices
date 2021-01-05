import {
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

import { Observable } from 'rxjs';
import { CreateCategoryDto } from '../categories/dtos/create-category.dto';
import { UpdateCategoryDto } from '../categories/dtos/update-category.dto';
import { ProxyRMQService } from 'src/proxyrmq/proxyrmq.service';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private clientProxy: ProxyRMQService) {}
  private clientAdminBackend = this.clientProxy.ClientProxyAdminBackend();

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createCategory: CreateCategoryDto): any {
    return this.clientAdminBackend.emit('create-category', createCategory);
  }

  @Get()
  find(@Query('idCategory') _id: string): Observable<any> {
    return this.clientAdminBackend.send('find-category', _id ? _id : '');
  }

  @Put(':id')
  update(
    @Body() updateCategory: UpdateCategoryDto,
    @Param('id') _id: string,
  ): any {
    this.clientAdminBackend.emit('update-category', {
      id: _id,
      category: updateCategory,
    });
  }
  @Delete(':id')
  delete(@Param('id') id: string): any {
    this.clientAdminBackend.send('delete-category', id);
  }
}
