import { Arg, Mutation, Resolver } from 'type-graphql'
import { AuthenticateInput } from '../../dtos/inputs/authenticate-input'
import { AuthenticateService } from '../../services/authenticate-service'
import { AuthenticateResponse } from '../../dtos/models/authenticate-response'

@Resolver()
export class AuthenticateResolver {
  @Mutation(() => AuthenticateResponse)
  async login(@Arg('data') { email, password, rememberMe }: AuthenticateInput) {
    const authenticate = new AuthenticateService()
    const { token, user } = await authenticate.execute({ email, password, rememberMe })

    return {
      token,
      user,
    }
  }
}
