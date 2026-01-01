import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsDateString,
  IsPhoneNumber,
  isEmail,
  isDecimal,
  IsDefined,
  IsDecimal
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'EhUsername', default: 'admin' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'EhPassword', default: 'admin' })
  @IsNotEmpty()
  password: string;
}