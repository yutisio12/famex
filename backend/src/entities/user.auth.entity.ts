import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Expense } from "./expense.expense.entity";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true, default: null })
  name: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'int4', nullable: true, default: 0 })
  role: number;

  // @Column({ type: 'jsonb', nullable: true, default: null })
  // face_id: string;

  // @Column({ name: "face_id",type: 'jsonb', nullable: true, default: null })
  // faceDescriptor: number[];

  @Column({ type: 'jsonb', nullable: true, default: null })
  face_id: number[];

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];
}