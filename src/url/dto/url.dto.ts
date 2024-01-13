import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

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
