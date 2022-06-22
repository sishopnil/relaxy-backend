import { Type } from 'class-transformer';
import { BaseDto } from '../core/base.dto';
import { ReactDto } from '../story/react.dto';
import { UserDto } from '../user/user.dto';
import { PostCommentDto } from './post-comment.dto';

export class PostCommentReactDto extends BaseDto {
  @Type(() => PostCommentDto)
  postComment: PostCommentDto;

  @Type(() => ReactDto)
  react: ReactDto;

  @Type(() => UserDto)
  reactedBy: UserDto;
}
