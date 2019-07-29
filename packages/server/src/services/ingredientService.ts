import Ingredient, { IIngredient } from '../models/Ingredient'
import ResourceManager, { MongoCRUDService } from '../resources'

interface IngredientFields {
  name: string,
  defaultUnit: ID,
}

type IngredientService = MongoCRUDService<IIngredient, IngredientFields>

export default ResourceManager.asSimpleMongoCRUDService<IngredientService, IIngredient, IngredientFields>({
  name: 'ingredient',
  model: Ingredient,
  hasOwner: false,
})
