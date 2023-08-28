import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Res,
  BadRequestException,
  NotFoundException,
  Redirect,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiTags('URL Shortner')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @ApiBody({
    schema: {
      properties: {
        url: { type: 'string' },
      },
      required: ['url'],
    },
  })
  async generateShortURL(
    @Body('url') url: string,
  ): Promise<{ ShortUrl: string }> {
    try {
      const shortUrl = await this.urlService.generateShortURL(url);
      return { ShortUrl: shortUrl };
    } catch (error) {
      throw new BadRequestException('URL is required');
    }
  }

  @Get('analytics/:shortId')
  async getAnalytics(@Param('shortId') shortId: string): Promise<any> {
    try {
      const analytics = await this.urlService.getAnalytics(shortId);
      return analytics;
    } catch (error) {
      throw new NotFoundException('Analytics not found');
    }
  }

  @Get(':shortId')
  @Redirect()
  async redirectToOriginalUrl(
    @Param('shortId') shortId: string,
    @Res() res: Response,
  ) {
    const clientIp = await this.urlService.getClientIpInfo();
    try {
      const entry = await this.urlService.updateVisitHistory(shortId, clientIp);

      if (!entry) {
        throw new NotFoundException('Invalid URL ID');
      }

      return { url: entry.redirectURL };
    } catch (error) {
      throw new NotFoundException('Invalid URL ID');
    }
  }
}
