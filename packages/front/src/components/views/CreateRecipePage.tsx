import React, { FunctionComponent, useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo-hooks'
import { Segment, Button } from 'semantic-ui-react'
import uuidv1 from 'uuid/v1'

import { PageWithHeadingAndBreadcrumb, PageWithBreadcrumbsProps } from './PageBase'
import { MY_RECIPES, NEW_RECIPES } from '../recipes/RecipesQuery'
import { RouteComponentProps, withRouter } from 'react-router'
import EditRecipeForm from '../recipes/EditRecipeForm'
import { Recipe } from '../../types'


const CREATE_RECIPE = gql`
mutation create($name: String!, $description: String!, $ingredients: [ShallowRecipeIngredient!]) {
  addRecipe(
    name: $name,
    description: $description
    ingredients: $ingredients
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

interface CraeteRecipeVariables {
  name: string,
  description?: string,
  ingredients: {
    amount: number,
    unit: string,
    ingredient: string,
  }[],
}

interface CreateRecipeProps extends PageWithBreadcrumbsProps, RouteComponentProps { }

const CreateRecipePage: FunctionComponent<CreateRecipeProps> = ({ history, breadcrumbs }) => {
  const [recipe, setRecipe] = useState<Recipe>({
    id: uuidv1(),
    name: 'My awesome recipe',
    views: 0,
    description: 'A short one-line description of your recipe',
    ingredients: [],
  })

  const [createMutation] = useMutation<CreateRecipeResult, CraeteRecipeVariables>(CREATE_RECIPE, {
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

  const createRecipe = async () => {
    try {
      const result = await createMutation({
        variables: {
          name: recipe.name,
          description: recipe.description,
          // Remove temporary IDs from ingredients and reduce fields with object references
          // to just IDs
          ingredients: recipe.ingredients
            // TODO: Instead of filter, validate and fail with error notification
            .filter((i) => i.unit.id !== 'DUMMY' && i.ingredient.id !== 'DUMMY')
            .map((i) => ({
              amount: i.amount,
              unit: i.unit.id,
              ingredient: i.ingredient.id,
            }))
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
    } catch (error) {
      console.log('error creating recipe: ', error)
    }
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
      <Segment className='clearfix'>
        <Button
          floated='right'
          positive
          onClick={createRecipe}
        >
          Create Recipe
        </Button>
      </Segment>
    </PageWithHeadingAndBreadcrumb>
  )
}

export default withRouter(CreateRecipePage)
