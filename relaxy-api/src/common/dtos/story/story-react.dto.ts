import { Type } from 'class-transformer';
import { BaseDto } from '../core/base.dto';
import { UserDto } from '../user/user.dto';
import { ReactDto } from './react.dto';
import { StoryDto } from './story.dto';

export class StoryReactDto extends BaseDto {
  @Type(() => StoryDto)
  story: StoryDto;

  @Type(() => ReactDto)
  react: ReactDto;

  @Type(() => UserDto)
  reactedBy: UserDto;
}


