import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Address } from './Address'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  passwordHash: string

  @Column()
  birthDate: string

  @OneToMany(() => Address, (address) => address.user)
  address: Address[]
}
