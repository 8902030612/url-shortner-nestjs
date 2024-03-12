import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './entities/url.schema';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 2,
      },
    ]),
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    HttpModule,
  ],
  controllers: [UrlController],
  providers: [
    UrlService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class UrlModule {}
