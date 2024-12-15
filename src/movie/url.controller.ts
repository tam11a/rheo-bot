import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { MovieProxyService } from './url.service';
import { Response } from 'express';

@Controller('movie-proxy')
export class MovieProxyController {
  constructor(private readonly proxyService: MovieProxyService) {}

  @Get('decode')
  async decode(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      throw new HttpException('Target URL is required', HttpStatus.BAD_REQUEST);
    }

    try {
      // Call the proxy service to forward the request
      const response = await this.proxyService.decode(url);

      // Set the appropriate headers to forward the file (copy from the target response)
      const contentType = response.headers['content-type'];
      res.setHeader('Content-Type', contentType);

      // Stream the file to the client
      response.data.pipe(res); // This pipes the file content directly to the client
    } catch {
      throw new HttpException(
        'Failed to forward request',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
