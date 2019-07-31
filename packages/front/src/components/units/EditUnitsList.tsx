import React, { FunctionComponent } from 'react'
import { Unit } from '../MainApp'

interface EditUnitsListProps {
  units: Unit[],
}

const EditUnitsList: FunctionComponent<EditUnitsListProps> = ({ units }) => {
  return (
    <ul>
      {units.map((unit) =>
        <li key={unit.id}>{unit.name} ({unit.abbreviation})</li>
      )}
    </ul>
  )
}

export default EditUnitsList
