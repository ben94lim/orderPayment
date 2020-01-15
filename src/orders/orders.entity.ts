import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @Column('varchar')
  status: string;

  @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
  created: Date;
}
