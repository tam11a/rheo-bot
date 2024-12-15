import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MovieProxyService {
  async decode(url: string) {
    try {
      const response = await axios({
        method: 'GET', // You can adjust this for other methods like POST if needed
        url: url,
        responseType: 'stream', // This tells axios to treat the response as a stream
      });

      return response; // Return the full axios response (including stream data)
    } catch {
      throw new HttpException(
        'Failed to forward request',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
