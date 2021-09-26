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
  
    @Column()
    name: string;
  
    @Column()
    surname: string;

    @Column()
    lastname: string;
  
    @Column()
    email: string;
  
    @Column({
      unique: true,
    })
    phone: string;
  
    @Column()
    password: string;

    @Column()
    code: number;
}
  