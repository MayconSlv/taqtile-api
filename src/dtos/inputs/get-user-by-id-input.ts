import { IsString } from 'class-validator'
import { Field, InputType, ID } from 'type-graphql'

@InputType()
export class GetUserByIdInput {
  @Field(() => ID)
  @IsString()
  userId: string
}
