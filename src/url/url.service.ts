import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';

import { Url } from './entities/url.schema';
import { AxiosError, AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<Url>,
    private httpService: HttpService,
  ) {}

  async generateShortURL(redirectURL: string): Promise<string> {
    const shortId = nanoid(5);

    await this.urlModel.create({
      shortId,
      redirectURL,
      visitHistory: [],
    });
    return shortId;
  }

  async generateCustomShortURI(
    redirectURL: string,
    customSlug: string,
  ): Promise<string> {
    const shortId = customSlug;
    const existingUrl = await this.urlModel.findOne({ shortId });

    if (existingUrl) {
      throw new HttpException(
        'Custom slug is already in use',
        HttpStatus.CONFLICT,
      );
    }

    await this.urlModel.create({
      shortId,
      redirectURL,
      visitHistory: [],
    });
    return shortId;
  }

  extractShortID(shortUrl: string): string {
    return shortUrl.substring(shortUrl.lastIndexOf('/') + 1);
  }

  async getAnalytics(shortId: string): Promise<any> {
    const result = await this.urlModel.findOne({ shortId });
    return {
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    };
  }

  // Fetch client IP info
  async getClientIpInfo(): Promise<any> {
    const ipApiUrl = 'http://ip-api.com/json/?fields=8192';

    const responseData = await lastValueFrom(
      this.httpService.get(ipApiUrl).pipe(
        map((response: AxiosResponse) => {
          return response.data;
        }),
        catchError((error: AxiosError) => {
          throw error;
        }),
      ),
    );
    return responseData;
  }

  async updateVisitHistory(shortId: string, clientIp: any): Promise<any> {
    return this.urlModel.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
            ipAddress: clientIp.query,
          },
        },
      },
    );
  }
}
