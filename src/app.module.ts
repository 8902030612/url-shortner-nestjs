import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './url/url.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://DB:admin123@clusterdb.5oifzk2.mongodb.net/urlshortner',
    ),
    UrlModule,
    HealthModule,
  ],
})
export class AppModule {}
