import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column()
  title: string;

  @Column()
  cost: number;

  @Column()
  sendAddress: string;

  @Column()
  recipientAddress: string;

  @Column()
  deliveryCost: number;

  @Column()
  weight: number;

  @Column()
  height: number;

  @Column()
  width: number;

  @Column()
  userId: number;

  @Column()
  latitude: number;

  @Column()
  longtitude: number;

  @CreateDateColumn()
  createDate: Date

  @Column({
    default: 'В обробцi',
  })
  status: string;
}
