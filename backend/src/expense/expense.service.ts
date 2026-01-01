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
      console.log('Received user ID:', idUser);
      console.log('Received DTO data:', JSON.stringify(createExpenseDto, null, 2));

      const formData = createExpenseDto.map(value => ({
        ...value,
        user_id: idUser
      }));
      console.log('Formatted data to save:', JSON.stringify(formData, null, 2));

      // Create the expense entities
      const newExpense = this.expenseRepository.create(formData);
      console.log('Created expense entities:', JSON.stringify(newExpense, null, 2));

      // Save to database
      console.log('Attempting to save to database...');
      const savedExpense = await this.expenseRepository.save(newExpense);
      console.log('Successfully saved expense:', JSON.stringify(savedExpense, null, 2));
      
      return {
        success: true,
        data: savedExpense
      };
    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        code: error.code,
        detail: error.detail,
        parameters: error.parameters,
        stack: error.stack
      });

      if (error.code === '23503') {
        throw new BadRequestException('Invalid category_id or user_id reference');
      }
      throw new BadRequestException(`Failed to insert data: ${error.message}`);
    }
  }

  // findAll() {
  async findAll(query: PaginationQueryDto, customWhere?: Record<string, any>) {
    const {page, limit, sort, search} = query
    const where: any = {}

    const datadb = this.expenseRepository.createQueryBuilder('expenses')
    datadb.leftJoinAndSelect('expenses.category', 'category');
    datadb.where({status_delete: 0})
    if(search){
      datadb.where('description ILIKE :search', {search: `%${search}%`})
    }
    if (customWhere) {
      Object.keys(customWhere).forEach((key) => {
        // Kalau value array, pakai IN
        if (Array.isArray(customWhere[key])) {
          datadb.andWhere(`expenses.${key} IN (:...${key})`, { [key]: customWhere[key] });
        } else {
          datadb.andWhere(`expenses.${key} = :${key}`, { [key]: customWhere[key] });
        }
      });
    }
    if(sort){
      const [sortBy, sortType] = sort.split(',')
      datadb.orderBy(`${sortBy}`, sortType.toUpperCase() === 'DESC' ? 'DESC' : 'ASC')
    }
    datadb.skip((page - 1) * limit).take(limit);
    const [data, total] = await datadb.getManyAndCount()

    return new PaginationResponseDto(data, total, page, limit);
  }

  findOne(id: number) {
    return `This action returns a #id expense`;
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
