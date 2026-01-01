import { Module } from '@nestjs/common';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { EncryptionService } from 'src/utils/encryption.service';
import { SftpService } from 'src/utils/sftp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from 'src/entities/expense.expense.entity';
import { MasterExpendCat } from 'src/entities/master.master-expend-cat-entity';
import { Log } from 'src/entities/log.log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, MasterExpendCat, Log], 'authConnection')],
  controllers: [ExpenseController],
  providers: [ExpenseService, EncryptionService, SftpService],
  exports: [],
})
export class ExpenseModule {}
