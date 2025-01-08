import { Injectable } from '@nestjs/common';
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord';
import { MovieSearchDto } from './dto/search.dto';
import { YtsService } from '@app/yts';
import {
  APIEmbed,
  // ButtonBuilder,
  // ButtonStyle,
  // ComponentType,
  JSONEncodable,
} from 'discord.js';
import urlJoin from 'url-join';

@Injectable()
export class MovieService {
  constructor(private readonly yts: YtsService) {}

  @SlashCommand({
    name: 'search',
    description: 'Search a movie!',
  })
  public async onLength(
    @Context() [interaction]: SlashCommandContext,
    @Options() { query_term }: MovieSearchDto,
  ) {
    // Search for the movie using the query_term provided by the user in the command options and return the result to the user.
    const movies = await this.yts.searchMovie(query_term);

    if (movies.status === 'error') {
      return interaction.reply({
        content: movies.message,
        ephemeral: true,
      });
    }

    const embeds: (APIEmbed | JSONEncodable<APIEmbed>)[] =
      movies.data.movies.map(
        (movie: any): APIEmbed | JSONEncodable<APIEmbed> => {
          return {
            title: movie.title_long || movie.title,
            description: movie.yt_trailer_code
              ? `[🚀 Watch Trailer](https://www.youtube.com/watch?v=${movie.yt_trailer_code})`
              : null,
            fields: [
              {
                name: '🎟️ IMDB Code',
                value: movie.imdb_code,
                inline: true,
              },
              {
                name: '⭐ Rating',
                value: movie.rating ? movie.rating.toString() : 'N/A',
                inline: true,
              },
              {
                name: '📅 Year',
                value: (movie.year as string) || 'N/A',
                inline: true,
              },
              {
                name: '🎊 Genres',
                value: movie.genres.join(', '),
                inline: true,
              },
              {
                name: '🌐 Language',
                value: movie.language || 'N/A',
                inline: true,
              },
              {
                name: '🕘 Runtime',
                value: `${movie.runtime || 'N/A'} min`,
                inline: true,
              },
              {
                name: '▶️ Torrents',
                value: movie.torrents
                  .map((torrent: any) => {
                    console.log(torrent);
                    return ` [${torrent.quality}-${torrent.type} S-${torrent.seeds} P-${torrent.peers} (${torrent.size})](${urlJoin(process.env.MY_DOMAIN, '/proxy/yts/torrent/', torrent.hash)})`;
                  })
                  .join(' \n '),
              },
            ],
            thumbnail: {
              url: movie.medium_cover_image,
            },
          };
        },
      );

    // const buttons = [
    //   new ButtonBuilder()
    //     .setLabel('Previous Page')
    //     .setStyle(ButtonStyle.Secondary)
    //     .setCustomId(`movie_torrent_yts_page_2`),
    //   new ButtonBuilder()
    //     .setLabel('Next Page')
    //     .setStyle(ButtonStyle.Primary)
    //     .setCustomId(`movie_torrent_yts_page_2`),
    // ];

    return interaction.reply({
      content: movies.message,
      embeds,
      // components: [
      // {
      // type: ComponentType.ActionRow,
      // components: buttons,
      // },
      // ],
    });
  }
}
