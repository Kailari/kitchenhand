import Unit, { IUnit } from '../models/Unit'
import { MongoCRUDService } from '../resources/mongoResource'
import Recipe from '../models/Recipe'
import Ingredient from '../models/Ingredient'

interface UnitFields {
  name: string,
  abbreviation?: string,
}

let __nullId: string
const getNullID = async (): Promise<string> => {
  if (!__nullId) {
    const found = await Unit.findOne({ name: '__removed' })
    if (!found) {
      const created = await new Unit({ name: '__removed' }).save()
      __nullId = created.id
    }
  }

  return __nullId
}

export class UnitService extends MongoCRUDService<IUnit, UnitFields> {
  public constructor() {
    super('unit', Unit)
    getNullID()
  }

  public async getAll(): Promise<IUnit[]> {
    return await Unit.find({ name: { $not: { $in: ['__removed'] } } })
  }

  public async remove(id: ID): Promise<IUnit | null> {
    const removed = await super.remove(id)
    if (!removed) {
      return null
    }

    this.removeFromIngredients(id)
    this.removeFromRecipeIngredients(id)

    return removed
  }

  private async removeFromIngredients(id: ID): Promise<void> {
    const nullId = await getNullID()
    await Ingredient.updateMany(
      // From all ingredients which have their default unit set to the removed unit
      { defaultUnit: id, },
      // replace the default unit ID with null ID
      { $set: { defaultUnit: nullId } },
    )
  }

  private async removeFromRecipeIngredients(id: ID): Promise<void> {
    const nullId = await getNullID()
    await Recipe.updateMany(
      // From all recipes which have an ingredient using the removed unit
      { ingredients: { $elemMatch: { unit: id } } },
      // replace ingredients' unit IDs with null ID...
      { $set: { 'ingredients.$[i].unit': nullId } },
      // ...but only for IDs that match the removed id
      { arrayFilters: [{ 'i.unit': id }] })
  }
}

export default new UnitService()
