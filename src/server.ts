import 'reflect-metadata'
import { ApolloServer, gql } from 'apollo-server'
import { AppDataSource } from './data-source'
import { User } from './entities/User'

const typeDefs = gql`
	type User {
		id: ID!
		name: String
	}

	type Query {
		users: [User]
	}

	type Mutation {
		create(name: String): User!
	}
`

const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query: {
			async users() {
				const repo = AppDataSource.getRepository(User)
				const users = await repo.find()

				return users
			}
		},
		Mutation: {
			create: async (_, args) => {
				const repo = AppDataSource.getRepository(User)

				const user = repo.create({
					name: args.name
				})
				await repo.save(user)

				return user
			}
		}
	},
})

AppDataSource.initialize().then(() => {
	console.log('Database OK.')
	server.listen().then(({ url }) => console.log(`Server is running on ${url}`))
}).catch((err) => {
	console.log('Error:', err)
})
