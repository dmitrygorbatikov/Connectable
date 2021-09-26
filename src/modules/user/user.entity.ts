import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: null
  })
  name: string;

  @Column({
    default: null
  })
  surname: string;

  @Column({
    default: null
  })
  lastname: string;

  @Column({
    type: 'longtext',
    default: null,
  })
  img: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
    default: null
  })
  phone: string;

  @Column()
  password: string;

  @CreateDateColumn()
  registerDate: string;

  @Column({
    default: 'user',
  })
  role: string;
}
