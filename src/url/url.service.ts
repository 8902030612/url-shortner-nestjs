import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
//@ts-ignore
import nanoid from 'nanoid';
import { Url } from './url.schema';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>) {}

  async generateShortURL(redirectURL: string): Promise<string> {
    const shortId = nanoid(6);

    const urlEntry = new this.urlModel({
      shortId,
      redirectURL,
      visitHistory: [],
    });
    await urlEntry.save();
    return `${process.env.BASE_URL || 'http://localhost:3000'}/${shortId}`;
  }

  async getAnalytics(shortId: string): Promise<any> {
    const result = await this.urlModel.findOne({ shortId });
    return {
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    };
  }

  async getClientIpInfo(): Promise<any> {
    // Fetch client IP info
    const response = await fetch('http://ip-api.com/json/?fields=8192');
    return response.json();
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
