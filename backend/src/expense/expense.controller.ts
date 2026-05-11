import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/decorators/roles-decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../entities/user.auth.entity';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/pagination/pagination-query.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Expenses')
@ApiBearerAuth('access-token')
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
  @UseGuards(RolesGuard)
  @Roles(1)
  @ApiOperation({ summary: 'Get all expenses (Admin only)' })
  findAll(
    @Query() query: PaginationQueryDto,
  ) {
    return this.expenseService.findAll(query);
  }

  @Throttle({ user: {  } })
  @Get('me')
  findAllTransUser(
    @Query() query: PaginationQueryDto,
    @GetUser() user: User,
  ) {
    return this.expenseService.findAll(query, { user_id: user.id });
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
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @GetUser() user: User,
  ) {
    const expense = await this.expenseService.findOneRaw(+id);
    if (!expense || expense.user_id !== user.id) {
      throw new ForbiddenException('You can only update your own expenses');
    }
    return this.expenseService.update(+id, updateExpenseDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    const expense = await this.expenseService.findOneRaw(+id);
    if (!expense || expense.user_id !== user.id) {
      throw new ForbiddenException('You can only delete your own expenses');
    }
    return this.expenseService.remove(+id);
  }
}
