import { join } from 'node:path'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'admin',
	password: 'admin',
	database: 'localdb',
	synchronize: true,
	logging: true,
	entities: [join(__dirname, './entities/*.ts')],
	migrations: ['/migrations/*.ts'],
	subscribers: [],
})
