import { IsNumber } from 'class-validator'
import { Field, InputType, Int } from 'type-graphql'

@InputType()
export class FetchUsersInput {
  @Field(() => Int)
  @IsNumber()
  quantity: number

  @Field(() => Int)
  @IsNumber()
  skipedUsers: number
}
