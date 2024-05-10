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
  HttpStatus,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UrlDto, CustomShortURIDto, ShortUrlDto } from './dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('')
@ApiTags('URL Shortner')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  // @SkipThrottle()
  async generateShortURL(
    @Res() res: Response,
    @Body() { url }: UrlDto,
  ): Promise<any> {
    if (!url) {
      throw new BadRequestException('url is required');
    }
    const shortId = await this.urlService.generateShortURL(url);
    // console.log({ ShortUrl: shortUrl });

    return res.status(HttpStatus.OK).json({
      message: 'ShortUrl generated successfully!',
      ShortId: shortId,
      ShortUrl: `${process.env.BASE_URL}/${shortId}`,
      statusCode: HttpStatus.OK,
    });
  }

  // customSlugShortedURI
  @Post('/customSlug')
  @SkipThrottle()
  async generateCustomShortURL(
    @Res() res: Response,
    @Body() { url, customSlug }: CustomShortURIDto,
  ): Promise<any> {
    if (!url) {
      throw new BadRequestException('url is required');
    }
    const shortId = await this.urlService.generateCustomShortURI(
      url,
      customSlug,
    );
    // console.log({ ShortUrl: shortUrl });

    return res.status(HttpStatus.OK).json({
      message: 'ShortUrl generated successfully!',
      ShortId: shortId,
      ShortUrl: `${process.env.BASE_URL}/${shortId}`,
      statusCode: HttpStatus.OK,
    });
  }

  @SkipThrottle()
  @Post('analytics')
  async getAnalytics(
    @Res() res: Response,
    @Body() { shortUrl }: ShortUrlDto,
  ): Promise<any> {
    try {
      const shortId = this.urlService.extractShortID(shortUrl);
      const analytics = await this.urlService.getAnalytics(shortId);

      return res.status(HttpStatus.OK).json({
        message: 'Analytics generated successfully!',
        visitHistory: analytics,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      throw new NotFoundException('Analytics not found');
    }
  }

  @Get(':shortId')
  @SkipThrottle()
  @Redirect()
  async redirectToOriginalUrl(@Param('shortId') shortId: string) {
    const clientIp = await this.urlService.getClientIpInfo();

    const entry = await this.urlService.updateVisitHistory(shortId, clientIp);

    if (!entry) {
      throw new NotFoundException('Invalid shortId');
    }

    return { url: entry.redirectURL };
  }
}
