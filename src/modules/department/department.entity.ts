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

  @Column({
    type: "double"
  })
  latitude: number;

  @Column({
    type: "double"
  })
  longtitude: number;
}
