import Ingredient, { IIngredient } from '../models/Ingredient'
import unitService from './unitService'

var DEFAULT: IIngredient | null

const getDefault = async (): Promise<IIngredient> => {
  if (!DEFAULT) {
    const defaultFromDb = await Ingredient.findOne({ name: 'default' })
    const defaultUnit = await unitService.getDefault()
    DEFAULT = defaultFromDb === null
      ? await new Ingredient({ id: 'DEFAULT_DUMMY', name: 'default', defaultUnit: defaultUnit }).save()
      : defaultFromDb
  }

  return DEFAULT as IIngredient
}

export default {
  getDefault,
}
