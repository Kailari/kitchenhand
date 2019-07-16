import React, { FunctionComponent, useState } from 'react'
import { gql } from 'apollo-boost'
import { useMutation } from 'react-apollo-hooks'
import uuidv1 from 'uuid/v1'

import { PageWithHeadingAndBreadcrumb, PageWithBreadcrumbsProps } from './PageBase'
import { MY_RECIPES, NEW_RECIPES } from '../recipes/RecipesQuery'
import { RouteComponentProps, withRouter } from 'react-router'
import EditRecipeForm from '../recipes/EditRecipeForm'
import { Recipe, RecipeIngredient } from '../MainApp'


const CREATE_RECIPE = gql`
mutation create($name: String!, $description: String!) {
  addRecipe(
    name: $name,
    description: $description
  ) {
    id
    name
    description
  }
}`

interface CreateRecipeResult {
  addRecipe: {
    id: string,
    name: string,
    description?: string,
  },
}

interface CreateRecipeProps extends PageWithBreadcrumbsProps, RouteComponentProps { }

const CreateRecipePage: FunctionComponent<CreateRecipeProps> = ({ history, breadcrumbs }) => {
  const [recipe, setRecipe] = useState<Recipe>({
    id: 'DUMMY',
    name: 'My awesome recipe',
    views: 0,
    description: 'A short one-line description of your recipe',
    ingredients: [],
  })

  const createMutation = useMutation<CreateRecipeResult>(CREATE_RECIPE, {
    refetchQueries: [
      { query: NEW_RECIPES },
      { query: MY_RECIPES },
    ]
  })

  const createIngredient = () => ({
    id: uuidv1(),
    amount: 1,
    unit: {
      id: 'DUMMY',
      name: 'unit',
      abbreviation: 'unit'
    },
    ingredient: {
      id: 'DUMMY',
      name: 'ingredient'
    }
  })

  const createRecipe = async (name: string, description: string) => {
    const result = await createMutation({
      variables: {
        name,
        description
      }
    })

    if (!result.data) {
      // TODO: Error
      console.log('adding recipe failed')
      return
    }

    const newRecipe = result.data.addRecipe
    console.log('recipe: ', newRecipe)
    history.replace(`/recipes/${newRecipe.id}`)
  }

  return (
    <PageWithHeadingAndBreadcrumb
      title='Create new recipe'
      breadcrumbs={breadcrumbs}
    >
      <EditRecipeForm
        recipe={recipe}
        setRecipe={setRecipe}
        ingredientFactory={createIngredient}
      />
    </PageWithHeadingAndBreadcrumb>
  )
}

export default withRouter(CreateRecipePage)
