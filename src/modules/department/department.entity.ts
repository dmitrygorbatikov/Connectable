import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'departments' })
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  latitude: number;

  @Column()
  longtitude: number;
}
