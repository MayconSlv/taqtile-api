import { Field, ID, ObjectType } from 'type-graphql'
import { Address } from './address-model'

@ObjectType()
export class User {
  @Field(() => ID)
  id: string

  @Field()
  birthDate: string

  @Field()
  email: string

  @Field()
  name: string

  @Field(() => [Address])
  addresses: Address[]
}
