import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  cep: string

  @Column()
  street: string

  @Column()
  streetNumber: string

  @Column()
  complement: string

  @Column()
  neighborhood: string

  @Column()
  city: string

  @Column()
  state: string

  @ManyToOne(() => User, (user) => user.adresses, { onDelete: 'CASCADE' })
  user: User
}
