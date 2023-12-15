import { Field, Int, ObjectType } from 'type-graphql'
import { User } from './user-model'

@ObjectType()
export class FetchUsersResponse {
  @Field(() => [User])
  users: User[]

  @Field(() => Int)
  totalUsers: number

  @Field()
  hasMoreAfter: boolean

  @Field()
  hasMoreBefore: boolean
}
