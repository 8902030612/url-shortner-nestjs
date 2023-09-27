import { Module } from '@nestjs/common';
import { UrlModule } from './url/url.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://DB:admin123@clusterdb.5oifzk2.mongodb.net/urlshortner',
    ),
    UrlModule,
  ],
})
export class AppModule {}
