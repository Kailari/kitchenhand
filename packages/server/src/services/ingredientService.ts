import Ingredient, { IIngredient } from '../models/Ingredient'
import { MongoCRUDService } from '../resources/mongoResource'

export interface IngredientFields {
  name: string,
  defaultUnit: ID,
}

export class IngredientService extends MongoCRUDService<IIngredient, IngredientFields> {
}

export default new IngredientService('ingredient', Ingredient)
