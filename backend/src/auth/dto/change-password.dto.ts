import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldP@ss1' })
  @IsNotEmpty()
  @IsString()
  current_password: string;

  @ApiProperty({ example: 'NewP@ss2' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, { message: 'Password must contain at least one letter and one number' })
  new_password: string;
}
