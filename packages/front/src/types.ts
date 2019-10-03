export type ID = string

export interface User {
  id: string,
  name: string,
}


export interface RecipeIngredient {
  id: string,
  index: number,
  amount: number,
  ingredient: {
    id: string,
    name: string,
  },
  unit: Unit,
}

export interface Recipe {
  id: string,
  name: string,
  views: number,
  category?: string,
  date?: Date,
  description?: string,
  owner?: User,
  ingredients: RecipeIngredient[],
}

export interface Unit {
  id: string,
  name: string,
  abbreviation?: string,
}

export interface Ingredient {
  id: string,
  name: string,
  defaultUnit?: Unit,
}

export type WithoutKey<T, Excluded = 'id'> = Pick<T, {
  [Key in keyof T]: Key extends Excluded ? never : Key
}[keyof T]>

export type Dirty<T, Excluded = 'id'> = {
  [Key in keyof WithoutKey<T, Excluded>]?: WithoutKey<T, Excluded>[Key]
}
