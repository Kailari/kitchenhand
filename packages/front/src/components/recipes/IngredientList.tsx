import React from 'react'
import IngredientEntry from './IngredientEntry'
import { RecipeIngredient } from '../views/RecipeEditor'

//interface IngredientListProps {
//}

interface IngredientListState {
  draggedIngredient: number,
  ingredients: RecipeIngredient[],
}

class IngredientList extends React.Component<{}, IngredientListState> {
  public constructor(props: {}) {
    super(props)
    this.state = {
      draggedIngredient: -1,
      ingredients: [
        { id: '2137', amount: 100 },
        { id: '1324', amount: 200 },
        { id: '3424', amount: 300 }
      ]
    }
  }

  private setDraggedElement(index: number) {
    console.log('setting dragged element to: ', index)
    this.setState({
      draggedIngredient: index,
      ingredients: this.state.ingredients
    })
  }

  private onDragOver = (index: number) => {
    console.log('foo')
    if (this.state.draggedIngredient === -1 || index === this.state.draggedIngredient) {
      return
    }

    const dragged = this.state.ingredients[this.state.draggedIngredient]
    const newIngredients = this.state.ingredients.filter((element) => element !== dragged)
    newIngredients.splice(index, 0, dragged)
    this.setState({
      draggedIngredient: index,
      ingredients: newIngredients
    })
  }

  public shouldComponentUpdate(nextProps: {}, nextState: IngredientListState) {
    const result = nextProps !== this.props || nextState.ingredients !== this.state.ingredients
    console.log('should update: ', result)
    return result
  }

  public render() {
    return (
      <div>
        {this.state.ingredients.map((ingredient, index) =>
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
