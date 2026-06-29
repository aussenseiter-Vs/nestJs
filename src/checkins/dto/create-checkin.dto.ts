import { IsOptional, IsString } from 'class-validator';

export class CreateCheckInDto {
  @IsOptional()
  @IsString()
  note?: string;
}
