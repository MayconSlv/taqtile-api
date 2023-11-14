import { AuthenticationError } from 'apollo-server'
import jwt from 'jsonwebtoken'

export function verifyToken(token: string) {
  try {
    const user = jwt.verify(token, String(process.env.JWT_SECRET))
    return user
  } catch (error) {
    throw new AuthenticationError('UNAUTHORIZED.')
  }
}
