import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UrlDto {
  @ApiProperty()
  @IsString({ message: 'URL must be a string' })
  @Matches(
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g,
    {
      message: 'Invalid URL format',
    },
  )
  url: string;
}

export class ShortUrlDto {
  @ApiProperty()
  @IsString({ message: 'URL must be a string' })
  shortUrl: string;
}

export class CustomShortURIDto {
  @ApiProperty()
  @IsString({ message: 'URL must be a string' })
  @Matches(
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g,
    {
      message: 'Invalid URL format',
    },
  )
  url: string;

  @ApiProperty()
  @IsString({ message: 'Custom slug must be a string' })
  @MinLength(1, { message: 'Custom slug must be at least 1 character long' })
  @MaxLength(6, { message: 'Custom slug cannot be longer than 6 characters' })
  customSlug: string;
}
