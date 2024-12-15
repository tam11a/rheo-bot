import { Module } from '@nestjs/common';
import { YtsService } from './yts.service';

@Module({
  providers: [YtsService],
  exports: [YtsService],
})
export class YtsModule {}
