import Unit, { IUnit } from '../models/Unit'
import ResourceManager, { MongoCRUDService } from '../resources'

interface UnitFields {
  name: string,
  abbreviation: string,
}

type UnitService = MongoCRUDService<IUnit, UnitFields>

export default ResourceManager.asSimpleMongoCRUDService<UnitService, IUnit, UnitFields>({
  name: 'unit',
  model: Unit,
  hasOwner: false,
})
