import React, { FunctionComponent } from 'react'
import { DropdownProps, Dropdown } from 'semantic-ui-react'

import { Unit } from '../../types'
import UnitsQuery, { ALL_UNITS } from '../units/UnitsQuery'


export interface SelectUnitDropdownProps extends DropdownProps {
  selected: Unit | null,
  select: (unit: Unit | null) => void,
}

const SelectUnitDropdown: FunctionComponent<SelectUnitDropdownProps> = ({ selected, select, ...props }) => {
  return (
    <UnitsQuery query={ALL_UNITS} render={(result) =>
      <Dropdown
        {...props}
        value={!result.loading && result.data && selected ? result.data.units.findIndex((unit) => unit.id === (selected as Unit).id) : -1}
        options={!result.loading && result.data ? result.data.units.map((unit, index) => ({
          key: unit.id,
          value: index,
          text: unit.name,
        })) : []}
        onChange={(e, { value: index }) => {
          if (!result.loading && result.data) {
            select(result.data.units[index as number])
          }
        }}
        loading={result.loading}
      />
    } />
  )
}

export default SelectUnitDropdown
