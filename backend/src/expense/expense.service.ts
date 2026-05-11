import { Injectable, UnauthorizedException, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PaginationQueryDto } from 'src/pagination/pagination-query.dto';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { EncryptionService } from 'src/utils/encryption.service';
import { MasterExpendCat } from 'src/entities/master.master-expend-cat-entity';
import { Log } from 'src/entities/log.log.entity';
import { Expense } from 'src/entities/expense.expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class ExpenseService {
  private static readonly ALLOWED_SORT_COLUMNS = ['id', 'amount', 'description', 'expense_date', 'created_at'];

  constructor(
    @InjectRepository(MasterExpendCat, 'authConnection')
    private masterCategoryRepository: Repository<MasterExpendCat>,
    
    @InjectRepository(Expense, 'authConnection')
    private expenseRepository: Repository<Expense>,
    
    @InjectRepository(Log, 'authConnection')
    private logRepository: Repository<Log>,

    private encryptionService: EncryptionService,
  ){}

  async create(idUser: number, createExpenseDto: CreateExpenseDto[]): Promise<any> {
    try {
      const formData = createExpenseDto.map(value => ({
        ...value,
        user_id: idUser
      }));

      const newExpense = this.expenseRepository.create(formData);
      const savedExpense = await this.expenseRepository.save(newExpense);

      return {
        success: true,
        data: savedExpense
      };
    } catch (error) {
      if (error.code === '23503') {
        throw new BadRequestException('Invalid category_id or user_id reference');
      }
      throw new BadRequestException('Failed to insert data');
    }
  }

  // findAll() {
  async findAll(query: PaginationQueryDto, customWhere?: Record<string, any>) {
    const {page, limit, sort, search} = query

    const datadb = this.expenseRepository.createQueryBuilder('expenses')
    datadb.leftJoinAndSelect('expenses.category', 'category');
    datadb.where({status_delete: 0})
    if(search){
      datadb.andWhere('description ILIKE :search', {search: `%${search}%`})
    }
    if (customWhere) {
      Object.keys(customWhere).forEach((key) => {
        if (Array.isArray(customWhere[key])) {
          datadb.andWhere(`expenses.${key} IN (:...${key})`, { [key]: customWhere[key] });
        } else {
          datadb.andWhere(`expenses.${key} = :${key}`, { [key]: customWhere[key] });
        }
      });
    }
    if(sort && sort !== null){
      let [sortBy, sortType] = sort.split(',')
      const safeSort = ExpenseService.ALLOWED_SORT_COLUMNS.includes(sortBy) ? sortBy : 'id';
      const safeSortKey = safeSort === 'id' ? 'expenses_id' : `expenses_${safeSort}`;
      datadb.orderBy(safeSortKey, sortType.toUpperCase() === 'DESC' ? 'DESC' : 'ASC')
    }
    datadb.skip((page - 1) * limit).take(limit);
    const [data, total] = await datadb.getManyAndCount()

    return new PaginationResponseDto(data, total, page, limit);
  }

  findOne(id: number) {
    return `This action returns a #${id} expense`;
  }

  async findOneRaw(id: number) {
    return this.expenseRepository.findOne({ where: { id } });
  }

  async findByUser(id: number) {
    const datadb = await this.expenseRepository.findBy({user_id: id, status_delete: 0})
    return datadb;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    const datadb = await this.expenseRepository.findOneBy({ id });
    if(!datadb){
      throw new NotFoundException();
    }
    const updated = this.expenseRepository.merge(datadb, updateExpenseDto);
    return this.expenseRepository.save(updated);
  }

  async remove(id: number) {
    try {
      const datadb = await this.expenseRepository.findOne({where: {id}});
      if(!datadb){
        throw new NotFoundException();
      }
      const formData = {
        status_delete: 1,
      }
      await this.expenseRepository.update(id, formData)

      const result = await this.expenseRepository.findOne({where: {id}});
      return result
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getCategory() {
    const datadb = await this.masterCategoryRepository.find()
    return datadb;
  }

}
