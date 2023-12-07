import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class AddressM {
  @Field()
  cep: string

  @Field()
  city: string

  @Field()
  complement: string

  @Field()
  id: string

  @Field()
  neighborhood: string

  @Field()
  state?: string

  @Field()
  street?: string

  @Field()
  streetNumber?: string
}
