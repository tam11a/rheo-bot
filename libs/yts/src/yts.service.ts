import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class YtsService {
  public quality_choices = [
    'all',
    '480p',
    '720p',
    '1080p',
    '1080p.x265',
    '2160p',
    '3D',
  ];

  public sort_choices = [
    'title',
    'year',
    'rating',
    'peers',
    'seeds',
    'download_count',
    'like_count',
    'date_added',
  ];

  public order_choices = ['asc', 'desc'];

  public async searchMovie(
    query_term: string,
    limit: number = 20,
    page: number = 1,
    quality: string = 'all',
    minimum_rating: number = 0,
    genre: string = 'all',
    sort_by: string = 'date_added',
    order_by: string = 'desc',
  ) {
    const url = `https://yts.mx/api/v2/list_movies.json`;
    const params = {
      query_term,
      limit,
      page,
      quality,
      minimum_rating,
      genre,
      sort_by,
      order_by,
    };

    const res = await axios.get(url, { params });

    if (!res.data)
      return {
        status: 'error',
        message: 'No movie found! Try again with different query!',
      };

    if (res.data?.data?.movie_count === 0)
      return {
        status: 'error',
        message: 'No movie found! Try again with different query!',
      };

    return {
      status: 'success',
      message: `Found ${res.data?.data?.movie_count} movies, with query: ${query_term}!`,
      data: res.data?.data,
    };
  }
}
