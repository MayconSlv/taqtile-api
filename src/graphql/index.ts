import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { join } from 'path'

const resolverFiles = loadFilesSync(join(__dirname, './**/resolvers.ts'))
const allTypes = loadFilesSync(join(__dirname, './**/schema.ts'))

export const resolvers = mergeResolvers(resolverFiles)
export const typeDefs = mergeTypeDefs(allTypes)
