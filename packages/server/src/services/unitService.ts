import Unit, { IUnit } from '../models/Unit'
import { MongoCRUDService } from '../resources/mongoResource'

interface UnitFields {
  name: string,
  abbreviation: string,
}

export class UnitService extends MongoCRUDService<IUnit, UnitFields> {
}

export default new UnitService('unit', Unit)
