import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { FileModule } from './files/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SubscriberModule } from './subscriber/subscriber.module';
import { CookiesModule } from './cookies/cookies.module';

@Module({
    imports: [SearchModule, FileModule, SubscriberModule, CookiesModule, ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'uploads'), // Serve files from the 'uploads' folder
        serveRoot: '/uploads', // The URL path to access uploaded files
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
