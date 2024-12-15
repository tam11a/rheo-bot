import { StringOption } from 'necord';

export class MovieSearchDto {
  @StringOption({
    name: 'query_term',
    description: 'Movie Name',
    required: true,
  })
  query_term: string;
}
