import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: '*' })
  resource: string;

  @Column({ default: '*' })
  action: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
