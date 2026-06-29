import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateHabitDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
