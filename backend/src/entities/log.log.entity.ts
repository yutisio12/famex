import { Expense } from './expense.expense.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('log')
export class Log {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int4' })
  id_expenses: number;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => Expense, (expense) => expense.id)
  expense: Expense;
}
