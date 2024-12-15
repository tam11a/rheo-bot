import { Injectable } from '@nestjs/common';
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord';
import { MovieSearchDto } from './dto/search.dto';
import { YtsService } from '@app/yts';
import { APIEmbed, JSONEncodable } from 'discord.js';

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
            description: movie.summary,
            fields: [
              {
                name: 'IMDB Code',
                value: movie.imdb_code,
                inline: true,
              },
              {
                name: 'Rating',
                value: movie.rating ? movie.rating.toString() : 'N/A',
                inline: true,
              },
              {
                name: 'Year',
                value: (movie.year as string) || 'N/A',
                inline: true,
              },
              {
                name: 'Genres',
                value: movie.genres.join(', '),
                inline: true,
              },
              {
                name: 'Language',
                value: movie.language || 'N/A',
                inline: true,
              },
              {
                name: 'Runtime',
                value: `${movie.runtime || 'N/A'} min`,
                inline: true,
              },
              {
                name: 'Torrents',
                value: movie.torrents
                  .map((torrent: any) => {
                    return `[${torrent.quality}](${torrent.url})`;
                  })
                  .join(' | '),
              },
            ],
            thumbnail: {
              url: movie.medium_cover_image,
            },
          };
        },
      );

    // const buttons = movies.data.movies.map((movie) => {
    //   return new ButtonBuilder()
    //     .setLabel(movie.title)
    //     .setStyle(ButtonStyle.Primary)
    //     .setCustomId(`movie_torrent_yts_${movie.id}`);
    // });

    return interaction.reply({
      content: movies.message,
      embeds,
      //   components: [
      //     {
      //       type: ComponentType.ActionRow,
      //       components: buttons,
      //     },
      //   ],
    });
  }
}
