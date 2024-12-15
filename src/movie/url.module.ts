import { Module } from '@nestjs/common';
import { MovieProxyService } from './url.service';
import { MovieProxyController } from './url.controller';

@Module({
  imports: [],
  controllers: [MovieProxyController],
  providers: [MovieProxyService],
})
export class MovieProxyModule {}
