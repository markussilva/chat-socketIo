import { ChatGateway } from './chat.gateway';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ChatGateway, AppService],
})
export class AppModule {}
