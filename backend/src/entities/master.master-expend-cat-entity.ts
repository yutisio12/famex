import { Expense } from './expense.expense.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('master_expend_cat')
export class MasterExpendCat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int4' })
  type: number;

  @OneToMany(() => Expense, (expense) => expense.category)
  expenses: Expense[];
}
