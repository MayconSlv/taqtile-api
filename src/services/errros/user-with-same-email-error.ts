export class UserWithSameEmailError extends Error {
  constructor() {
    super('User already exists with same email.')
  }
}
