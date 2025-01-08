import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProxyService {
  async ytsTorrentDownload(hash: string, res: any) {
    const url = `https://yts.mx/torrent/download/${hash}`;

    try {
      // Make a request to the source URL
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream', // Stream the response
      });

      // Set the appropriate headers
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${hash}.torrent"`,
      );
      res.setHeader('Content-Type', response.headers['content-type']);

      // Pipe the response to the client
      response.data.pipe(res);
    } catch (error) {
      console.error(`Error downloading file: ${error.message}`);
      res.status(500).send('Error fetching file.');
    }

    return `This action returns a #${hash} proxy`;
  }
}
