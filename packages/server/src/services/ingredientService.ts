import Ingredient, { IIngredient } from '../models/Ingredient'
import { MongoCRUDService } from '../resources/mongoResource'
import Recipe from '../models/Recipe';
import { DocumentQuery } from 'mongoose';

export interface IngredientFields {
  name: string,
  defaultUnit?: ID,
}

let __nullId: string
const getNullID = async (): Promise<string> => {
  if (!__nullId) {
    const found = await Ingredient.findOne({ name: '__removed' })
    if (!found) {
      const created = await new Ingredient({ name: '__removed' }).save()
      __nullId = created.id
    }
  }

  return __nullId
}

export class IngredientService extends MongoCRUDService<IIngredient, IngredientFields> {
  public constructor() {
    super('ingredient', Ingredient)
    getNullID()
  }

  public async getAll(): Promise<IIngredient[]> {
    return await Ingredient.find({ name: { $not: { $in: ['__removed'] } } }).populate('defaultUnit')
  }

  public async create(fields: IngredientFields): Promise<IIngredient | null> {
    const created = await super.create(fields)
    if (!created) {
      return null
    }

    return await created.populate('defaultUnit')
  }

  public async remove(id: ID): Promise<IIngredient | null> {
    const nullId = await getNullID()
    if (id === nullId) {
      return null
    }

    const removed = await super.remove(id)
    if (!removed) {
      return null
    }

    this.removeFromRecipeIngredients(id)

    return removed
  }

  public removeQuery(id: ID): DocumentQuery<IIngredient | null, IIngredient> {
    return super.removeQuery(id).populate('defaultUnit')
  }

  public updateQuery(id: ID, updatedFields: { [key: string]: any }): DocumentQuery<IIngredient | null, IIngredient> {
    return super.updateQuery(id, updatedFields).populate('defaultUnit')
  }

  private async removeFromRecipeIngredients(id: ID): Promise<void> {
    const nullId = await getNullID()
    await Recipe.updateMany(
      // From all recipes which have an recipe ingredient using the removed ingredient
      { ingredients: { $elemMatch: { ingredient: id } } },
      // replace recipe ingredients' ingredient IDs with null ID...
      { $set: { 'ingredients.$[i].ingredient': nullId } },
      // ...but only for IDs that match the removed id
      { arrayFilters: [{ 'i.ingredient': id }] })
  }
}

export default new IngredientService()
