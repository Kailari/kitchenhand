import React from 'react'
import { Item } from 'semantic-ui-react';
import RecipeCard from './RecipeCard';

const RecipeList = ({ recipes }) => {
  if (!recipes) {
    return <div>ERROR</div>
  }

  return (
    <Item.Group divided>
      {recipes.map(r =>
        <RecipeCard key={r.id} recipe={r} />
      )}
    </Item.Group>
  )
}

export default RecipeList