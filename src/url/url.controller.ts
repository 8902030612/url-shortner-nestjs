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
    const shortUrl = await this.urlService.generateShortURL(url);
    // console.log({ ShortUrl: shortUrl });

    return res.status(HttpStatus.OK).json({
      message: 'ShortUrl generated successfully!',
      ShortUrl: shortUrl,
      statusCode: 200,
    });
  }

  @Get('analytics/:shortId')
  async getAnalytics(
    @Res() res: Response,
    @Param('shortId') shortId: string,
  ): Promise<any> {
    try {
      const analytics = await this.urlService.getAnalytics(shortId);

      // console.log(analytics);

      return res.status(HttpStatus.OK).json({
        message: 'Analytics generated successfully!',
        visitHistory: analytics,
        statusCode: 200,
      });
    } catch (error) {
      throw new NotFoundException('Analytics not found');
    }
  }

  // Handle the case where shortId is missing
  @ApiExcludeEndpoint()
  @Get('analytics/')
  async handleMissingShortId(): Promise<void> {
    throw new BadRequestException('shortId is required');
  }

  @Get(':shortId')
  @Redirect()
  async redirectToOriginalUrl(@Param('shortId') shortId: string) {
    const clientIp = await this.urlService.getClientIpInfo();
    // console.log(clientIp);

    const entry = await this.urlService.updateVisitHistory(shortId, clientIp);

    if (!entry) {
      throw new NotFoundException('Invalid shortId');
    }

    return { url: entry.redirectURL };
  }
}
