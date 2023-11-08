import { join } from 'node:path'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [join(__dirname, './entities/*.ts')],
  migrations: [], // if  synchronize is false, set the path './migrations/*.ts'
  subscribers: [],
})
