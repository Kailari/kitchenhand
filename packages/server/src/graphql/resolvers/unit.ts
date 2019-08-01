import { QueryResolvers, MutationResolvers } from '../../generated/graphql'

import unitService from '../../services/unitService'
import { IUnit } from '../../models/Unit'
import { doValidation, validator } from 'validators'

export const queries: QueryResolvers = {
  allUnits: async (): Promise<IUnit[]> => await unitService.getAll(),
  unit: async (root, args): Promise<IUnit | null> => {
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
      abbreviation: args.abbreviation || undefined,
    })
  },
  updateUnit: async (root, args): Promise<IUnit | null> => {
    doValidation(args, [
      validator.isValidId('id'),
      validator.string('name', { minLength: 2, maxLength: 10 }),
      validator.string('abbreviation', { minLength: 1, maxLength: 10 }),
    ])

    const updatedFields = Object.keys(args)
      .filter((key): boolean => key !== 'id')
      .filter((key): boolean => (args as any)[key] !== undefined)
      .reduce((result: { [key: string]: any }, current: string): { [key: string]: any } => ({ ...result, [current]: (args as any)[current] }), {})

    return await unitService.update(args.id, updatedFields)
  },
  removeUnit: async (root, args): Promise<IUnit | null> => {
    doValidation(args, [
      validator.isValidId('id')
    ])

    return await unitService.remove(args.id)
  }
}
