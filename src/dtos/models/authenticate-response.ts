import { Field, ObjectType } from 'type-graphql'
import { User } from './user-model'

@ObjectType()
export class AuthenticateResponse {
  @Field(() => User)
  user: User

  @Field()
  token: string
}
