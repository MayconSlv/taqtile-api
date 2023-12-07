import { Field, ObjectType } from 'type-graphql'
import { AddressM } from './address-model'

@ObjectType()
export class MUser {
  @Field()
  id: string

  @Field()
  birthDate: string

  @Field()
  email: string

  @Field()
  name: string

  @Field(() => [AddressM])
  addresses: AddressM[]
}
