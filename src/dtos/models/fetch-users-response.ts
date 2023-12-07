import { Field, Int, ObjectType } from 'type-graphql'
import { MUser } from './user-model'

@ObjectType()
export class FetchUsersResponse {
  @Field(() => [MUser])
  users: MUser[]

  @Field(() => Int)
  totalUsers: number

  @Field()
  hasMoreAfter: boolean

  @Field()
  hasMoreBefore: boolean
}
