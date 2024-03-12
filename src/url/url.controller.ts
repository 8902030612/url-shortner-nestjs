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
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UrlDto } from './dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('')
@ApiTags('URL Shortner')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
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

  @SkipThrottle()
  @Get('analytics/:shortId')
  async getAnalytics(
    @Res() res: Response,
    @Param('shortId') shortId: string,
  ): Promise<any> {
    try {
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

  // Handle the case where shortId is missing
  @SkipThrottle()
  @ApiExcludeEndpoint()
  @Get('analytics/')
  async handleMissingShortId(): Promise<void> {
    throw new BadRequestException('shortId is required');
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
