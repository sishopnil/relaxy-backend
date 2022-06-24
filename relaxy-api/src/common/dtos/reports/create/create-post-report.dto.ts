import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { PostReportDto } from '../post-report.dto';

export class CreatePostReportDto extends PostReportDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Mood ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid Mood ID' })
  postId: string;
}
