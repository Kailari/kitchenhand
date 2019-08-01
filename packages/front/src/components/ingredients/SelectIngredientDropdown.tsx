import React, { FunctionComponent } from 'react'
import { DropdownProps, Dropdown } from 'semantic-ui-react'

import { Ingredient } from '../../types'
import IngredientsQuery, { ALL_INGREDIENTS, IngredientQueryData } from './IngredientsQuery'
import { QueryHookResult } from 'react-apollo-hooks'
import { OperationVariables } from 'apollo-client'


export interface SelectIngredientsDropdownProps extends DropdownProps {
  selected: Ingredient | null,
  select: (ingredient: Ingredient | null) => void,
}

const SelectIngredientDropdown: FunctionComponent<SelectIngredientsDropdownProps> = ({ selected, select, ...props }) => {
  const findSelected = (result: QueryHookResult<IngredientQueryData, OperationVariables>): number => {
    if (result.loading || !result.data || !selected) {
      return -1
    }

    return result.data.ingredients.findIndex((ingredient) => ingredient.id === selected.id)
  }

  return (
    <IngredientsQuery query={ALL_INGREDIENTS} render={(result) =>
      <Dropdown
        {...props}
        value={findSelected(result)}
        options={!result.loading && result.data ? result.data.ingredients.map((ingredient, index) => ({
          key: ingredient.id,
          value: index,
          text: ingredient.name,
        })) : []}
        onChange={(e, { value: index }) => {
          if (!result.loading && result.data) {
            select(result.data.ingredients[index as number])
          }
        }}
        loading={result.loading}
      />
    } />
  )
}

export default SelectIngredientDropdown
