import Unit, { IUnit } from '../models/Unit'
import { MongoCRUDService } from '../resources/mongoResource'

interface UnitFields {
  name: string,
  abbreviation: string,
}

export class UnitService extends MongoCRUDService<IUnit, UnitFields> {
  public async getAll(): Promise<IUnit[]> {
    return await Unit.find({})
  }
}

export default new UnitService('unit', Unit)
