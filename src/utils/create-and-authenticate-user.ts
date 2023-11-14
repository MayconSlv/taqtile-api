import axios from 'axios'
import { CreateUserService } from '../services/create-user-service'

export async function createAndAuthenticateUser() {
  const createUser = new CreateUserService()
  await createUser.execute({
    name: 'John Doe',
    email: 'johndoe@email.com',
    birthDate: '12-12-1990',
    password: '123456a',
  })

  const authResponse = await axios.post('http://localhost:4000', {
    query: `mutation ($data: LoginInput) {
      login(data: $data) {
        token user {
          name email id birthDate
        }
      }
    }`,
    variables: {
      data: {
        email: 'johndoe@email.com',
        password: '123456a',
        rememberMe: false,
      },
    },
  })

  const { token } = authResponse.data.data.login

  return {
    token,
  }
}
