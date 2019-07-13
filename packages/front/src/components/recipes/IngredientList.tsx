import React from 'react'
import IngredientEntry from './IngredientEntry'
import { RecipeIngredient } from '../views/RecipeEditor'

interface IngredientListProps {
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

  public shouldComponentUpdate(nextProps: {}, _nextState: IngredientListState) {
    return nextProps !== this.props /*|| nextState.ingredients !== this.state.ingredients*/
  }

  public render() {
    return (
      <div>
        {this.props.ingredients.map((ingredient, index) =>
          <IngredientEntry
            key={ingredient.id}
            setDraggedElement={() => this.setDraggedElement(index)}
            amount={ingredient.amount}
            setAmount={(amount) => ingredient.amount = amount}
            onDragOver={() => this.onDragOver(index)}
          />
        )}
      </div>
    )
  }
}

export default IngredientList
