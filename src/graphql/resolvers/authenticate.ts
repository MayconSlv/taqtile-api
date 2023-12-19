import { Arg, Mutation, Resolver } from 'type-graphql'
import { AuthenticateInput } from '../../dtos/inputs/authenticate-input'
import { AuthenticateService } from '../../services/authenticate-service'
import { AuthenticateResponse } from '../../dtos/models/authenticate-response'
import { Service } from 'typedi'

@Resolver()
@Service()
export class AuthenticateResolver {
  constructor(private authenticateService: AuthenticateService) {}

  @Mutation(() => AuthenticateResponse)
  async login(@Arg('data') { email, password, rememberMe }: AuthenticateInput) {
    return this.authenticateService.execute({ email, password, rememberMe })
  }
}
