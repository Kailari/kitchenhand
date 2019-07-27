import { QueryResolvers, MutationResolvers } from '../../generated/graphql'

import unitService from '../../services/unitService'
import { IUnit } from '../../models/Unit'
import { doValidation, validator } from '../../util/validation/validation'

export const queries: QueryResolvers = {
  getUnit: async (root, args): Promise<IUnit | null> => {
    doValidation(args, [
      validator.isValidId('id'),
    ])

    return await unitService.get(args.id)
  },
}

export const mutations: MutationResolvers = {
  addUnit: async (root, args): Promise<IUnit | null> => {
    doValidation(args, [
      validator.string('name', { minLength: 2, maxLength: 10 }),
      validator.string('abbreviation', { minLength: 1, maxLength: 10 }),
    ])

    return await unitService.create({
      name: args.name,
      abbreviation: args.abbreviation,
    })
  }
}
