import { IsEmail, IsString } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  name: string

  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsString()
  password: string

  @Field()
  @IsString()
  birthDate: string
}
