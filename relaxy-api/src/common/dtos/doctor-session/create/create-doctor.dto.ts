import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { DoctorDto } from '../doctor.dto';
import { IdDto } from '../id.dto';

export class CreateDoctorDto extends DoctorDto {
  @ApiProperty({ type: IdDto, isArray: true })
  @ValidateNested()
  @Type(() => IdDto)
  serviceIds: IdDto[];
}
