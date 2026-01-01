import { MasterExpendCat } from './master.master-expend-cat-entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.auth.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4' })
  user_id: number;

  @Column({ type: 'int4' })
  category_id: number;

  @Column({ type: 'numeric' })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  expense_date: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'int4' })
  type: number;

  @ManyToOne(() => User, (user) => user.expenses)
  @JoinColumn({ name: 'id' })
  user: User;

  @ManyToOne(() => MasterExpendCat, (cat) => cat.expenses)
  @JoinColumn({ name: 'category_id' })
  category: MasterExpendCat;

  @Column({ type: 'int4' })
  status_delete: number;
}
