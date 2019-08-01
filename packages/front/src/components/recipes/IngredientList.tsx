import React from 'react'
import IngredientEntry from './IngredientEntry'
import { RecipeIngredient } from '../../types'

interface IngredientListProps {
  showDelete: boolean,
  onRemove: (id: string) => void,
  ingredients: RecipeIngredient[],
  setIngredients: (ingredients: RecipeIngredient[]) => void,
}

interface IngredientListState {
  draggedIngredient: number,
}

class IngredientList extends React.Component<IngredientListProps, IngredientListState> {
  public constructor(props: IngredientListProps) {
    super(props)
    this.state = { draggedIngredient: -1 }
  }

  private setDraggedElement(index: number) {
    this.setState({ draggedIngredient: index })
  }

  private onDragOver = (index: number) => {
    if (this.state.draggedIngredient === -1 || index === this.state.draggedIngredient) {
      return
    }

    const dragged = this.props.ingredients[this.state.draggedIngredient]
    const newIngredients = this.props.ingredients.filter((element) => element !== dragged)
    newIngredients.splice(index, 0, dragged)
    this.setDraggedElement(index)
    this.props.setIngredients(newIngredients)
  }

  public shouldComponentUpdate(nextProps: IngredientListProps, _nextState: IngredientListState) {
    return nextProps !== this.props || nextProps.ingredients !== this.props.ingredients /*|| nextState.ingredients !== this.state.ingredients*/
  }

  public render() {
    return (
      <div>
        {this.props.ingredients.map((ingredient, index) =>
          <IngredientEntry
            showDelete={this.props.showDelete}
            onRemove={() => this.props.onRemove(ingredient.id)}
            key={ingredient.id}
            setDraggedElement={() => this.setDraggedElement(index)}
            amount={ingredient.amount}
            setAmount={(amount) => {
              const newIngredients = this.props.ingredients.concat()
                .map((i) => i.id !== ingredient.id
                  ? i
                  : { ...i, amount: amount})
              this.props.setIngredients(newIngredients)
            }}
            unit={ingredient.unit}
            setUnit={(unit) => {
              const newIngredients = this.props.ingredients.concat()
                .map((i) => i.id !== ingredient.id
                  ? i
                  : { ...i, unit: unit})
              this.props.setIngredients(newIngredients)
            }}
            onDragOver={() => this.onDragOver(index)}
          />
        )}
      </div>
    )
  }
}

export default IngredientList
