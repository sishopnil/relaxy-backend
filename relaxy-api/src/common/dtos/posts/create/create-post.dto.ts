import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { PostDto } from '../post.dto';
import { TagIdDto } from './tag-id.dto';

export class CreatePostDto extends PostDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Mood ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid Mood ID' })
  postTypeId: string;

  @ApiProperty({ type: TagIdDto, isArray: true })
  @ValidateNested()
  @Type(() => TagIdDto)
  tagsId: TagIdDto[];
}
