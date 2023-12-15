import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint()
export class PasswordValidator implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    return /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)
  }
}
