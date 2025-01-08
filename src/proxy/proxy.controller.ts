import { Controller, Get, Param, Res } from '@nestjs/common';
import { ProxyService } from './proxy.service';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('yts/torrent/:hash')
  ytsTorrentDownload(@Param('hash') hash: string, @Res() res) {
    return this.proxyService.ytsTorrentDownload(hash, res);
  }
}
