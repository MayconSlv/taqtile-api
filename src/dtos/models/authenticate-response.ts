import { Field, ObjectType } from 'type-graphql'
import { MUser } from './user-model'

@ObjectType()
export class AuthenticateResponse {
  @Field(() => MUser)
  user: MUser

  @Field()
  token: string
}
