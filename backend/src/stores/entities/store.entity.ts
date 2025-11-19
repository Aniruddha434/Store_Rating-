import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Rating } from '../../ratings/entities/rating.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  name: string;

  @Column()
  email: string;

  @Column({ length: 400 })
  address: string;

  @OneToMany(() => Rating, rating => rating.store)
  ratings: Rating[];
}
