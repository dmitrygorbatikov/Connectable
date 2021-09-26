import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity({ name: 'confirmemail' })
  export class ConfirmEmail {
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
  
    @Column()
    email: string;
  
    @Column({
      unique: true,
      default: null
    })
    phone: string;
  
    @Column()
    password: string;

    @Column()
    code: number;
}
  