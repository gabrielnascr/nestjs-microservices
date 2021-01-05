import { Module } from '@nestjs/common';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [ProxyrmqModule],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
