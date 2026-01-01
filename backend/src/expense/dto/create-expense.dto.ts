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

export class CreateExpenseDto {

  @ApiProperty({
    description: 'Type of expense (1: Income, 2: Expense)',
    example: 1,
    type: Number,
    default: 2
  })
  @IsNumber()
  @IsNotEmpty()
  type: number

  @ApiProperty({
    description: 'Category ID of the expense',
    example: 1,
    type: Number,
    required: false
  })
  @IsNumber()
  @IsOptional()
  category_id: number
  
  @ApiProperty({
    description: 'Amount of the expense',
    example: 100000,
    type: Number
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number
  
  @ApiProperty({
    description: 'Description of the expense',
    example: 'Bayar Uang Kas',
    required: false,
    type: String
  })
  @IsOptional()
  description: string
  
  @ApiProperty({
    description: 'Date of the expense',
    example: '2025-09-12',
    type: Date
  })
  @IsDateString()
  @IsNotEmpty()
  expense_date: Date

  

}