import { QueryResolvers, MutationResolvers } from '../../generated/graphql'
import ingredientService from '../../services/ingredientService'
import { IIngredient } from '../../models/Ingredient'
import { doValidation, validator } from 'validators'

export const queries: QueryResolvers = {
  allIngredients: async (): Promise<IIngredient[]> => await ingredientService.getAll(),
}

export const mutations: MutationResolvers = {
  addIngredient: async (root, args): Promise<IIngredient | null> => {
    doValidation(args, [
      validator.string('name', { minLength: 1, maxLength: 128 }),
      validator.isValidId('defaultUnitId'),
    ])

    return await ingredientService.create({
      name: args.name,
      defaultUnit: args.defaultUnitId || undefined,
    })
  },
  removeIngredient: async (root, args): Promise<IIngredient | null> => {
    doValidation(args, [
      validator.isValidId('id')
    ])

    return await ingredientService.remove(args.id)
  },
  updateIngredient: async (root, args): Promise<IIngredient | null> => {
    doValidation(args, [
      validator.isValidId('id'),
      validator.isValidId('defaultUnitId'),
      validator.string('name', { minLength: 1, maxLength: 128 }),
    ])

    const updatedFields = Object.keys(args)
      .filter((key): boolean => key !== 'id')
      .filter((key): boolean => (args as any)[key] !== undefined)
      .reduce((result: { [key: string]: any }, current: string): { [key: string]: any } => ({ ...result, [current]: (args as any)[current] }), {})

    return await ingredientService.update(args.id, updatedFields)
  }
}
