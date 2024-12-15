import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { AppService } from './app.service';
import { MovieService } from './movie/movie.service';
import { YtsModule } from '@app/yts';
import { MovieProxyModule } from './movie/url.module';

@Module({
  imports: [
    YtsModule,
    NecordModule.forRoot({
      token: process.env.DISCORD_TOKEN,
      intents: [IntentsBitField.Flags.Guilds],
      development: [process.env.DISCORD_DEVELOPMENT_GUILD_ID],
    }),
    MovieProxyModule,
  ],
  providers: [AppService, MovieService],
})
export class AppModule {}
