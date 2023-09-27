import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
//@ts-ignore
import nanoid from 'nanoid';
import { Url } from './url.schema';
import { AxiosError, AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import {
  catchError,
  lastValueFrom,
  map,
} from 'rxjs';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<Url>,
    private httpService: HttpService,
  ) {}

  async generateShortURL(redirectURL: string): Promise<string> {
    const shortId = nanoid(6);

    await this.urlModel.create({
      shortId,
      redirectURL,
      visitHistory: [],
    });
    return `${process.env.BASE_URL || 'http://localhost:5000'}/${shortId}`;
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
