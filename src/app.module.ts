import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { AppService } from './app.service';
import { MovieService } from './movie/movie.service';
import { YtsModule } from '@app/yts';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    YtsModule,
    NecordModule.forRoot({
      token: process.env.DISCORD_TOKEN,
      intents: [IntentsBitField.Flags.Guilds],
      development: [process.env.DISCORD_DEVELOPMENT_GUILD_ID],
    }),
    ProxyModule,
  ],
  providers: [AppService, MovieService],
})
export class AppModule {}
