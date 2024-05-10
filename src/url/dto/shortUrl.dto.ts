import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ShortUrlDto {
  @ApiProperty()
  @IsString({ message: 'URL must be a string' })
  shortUrl: string;
}
