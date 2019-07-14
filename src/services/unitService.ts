import Unit, { IUnit } from '../models/Unit'

var DEFAULT: IUnit | null = null

const getDefault = async (): Promise<IUnit> => {
  if (!DEFAULT) {
    const defaultFromDb = await Unit.findOne({ name: 'default' })
    DEFAULT = defaultFromDb === null
      ? await new Unit({ name: 'default', abbreviation: 'units' }).save()
      : defaultFromDb
  }

  return DEFAULT as IUnit
}

export default {
  getDefault,
}
