import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './entities/url.schema';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    HttpModule,
  ],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
