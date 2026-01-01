import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseService } from './expense.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../entities/user.auth.entity';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/pagination/pagination-query.dto';

@ApiTags('Expenses')
@ApiBearerAuth('access-token') // sesuai nama di main.ts
@ApiCookieAuth('access-token')
@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @ApiOperation({ summary: 'Create new expense' })
  @ApiResponse({ 
    status: 201, 
    description: 'The expense has been successfully created.',
    type: CreateExpenseDto,
    isArray: true
  })
  async create(
    @Body() createExpenseDto: CreateExpenseDto[],
    @GetUser() user: User,
  ) {
    const idUser = user.id;
    return this.expenseService.create(idUser, createExpenseDto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto, ) {
    return this.expenseService.findAll(query);
  }

  @Get('category')
  getCategory() {
    return this.expenseService.getCategory();
  }

  @Get('MyTransactional')
  MyTransactional(@GetUser() user: User) {
    return this.expenseService.findByUser(user.id);
  }

  @Get('transactionDetail:id')
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(+id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expenseService.remove(+id);
  }
}
