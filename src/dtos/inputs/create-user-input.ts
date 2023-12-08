import { IsEmail, IsString, MinLength, Validate } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { PasswordValidator } from '../../validators/password-validator'

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
  @MinLength(6, { message: 'The password must contain 6 characters.' })
  @Validate(PasswordValidator, { message: 'The password must contain 1 letter and 1 digit.' })
  password: string

  @Field()
  @IsString()
  birthDate: string
}
