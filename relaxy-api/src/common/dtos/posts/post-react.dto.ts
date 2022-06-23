import { Type } from 'class-transformer';
import { BaseDto } from '../core/base.dto';
import { ReactDto } from '../story/react.dto';
import { UserDto } from '../user/user.dto';
import { PostDto } from './post.dto';

export class PostReactDto extends BaseDto {
  @Type(() => PostDto)
  post: PostDto;

  @Type(() => ReactDto)
  react: ReactDto;

  @Type(() => UserDto)
  reactedBy: UserDto;
}
