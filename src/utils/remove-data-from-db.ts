import { ObjectLiteral, Repository } from 'typeorm'

export async function removeDataFromDatabase<Entity extends ObjectLiteral>(repository: Repository<Entity>) {
  const data = await repository.find()
  await repository.remove(data)
}
