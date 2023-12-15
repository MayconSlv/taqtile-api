import { Field, InputType } from 'type-graphql'
import { IsEmail, IsString } from 'class-validator'

@InputType()
export class AuthenticateInput {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsString()
  password: string

  @Field()
  rememberMe: boolean
}
