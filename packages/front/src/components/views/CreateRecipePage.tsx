import React, { FunctionComponent, useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { Segment, Button } from 'semantic-ui-react'
import uuidv1 from 'uuid/v1'

import { PageWithHeadingAndBreadcrumb, PageWithBreadcrumbsProps } from './PageBase'
import { MY_RECIPES, NEW_RECIPES } from '../recipes/RecipesQuery'
import { RouteComponentProps, withRouter } from 'react-router'
import EditRecipeForm from '../recipes/EditRecipeForm'
import { Recipe, Ingredient, Unit, RecipeIngredient } from '../../types'
import { ExecutionResult } from 'graphql'


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
    name: '',
    views: 0,
    description: '',
    ingredients: [],
  })

  const [createMutation] = useMutation<CreateRecipeResult, CraeteRecipeVariables>(CREATE_RECIPE, {
    refetchQueries: [
      { query: NEW_RECIPES },
      { query: MY_RECIPES },
    ]
  })

  const createRecipe = async () => {
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
    }) as ExecutionResult<CreateRecipeResult>

    if (!result.data) {
      // TODO: Error
      console.log('adding recipe failed')
      return
    }

    const newRecipe = result.data.addRecipe
    console.log('recipe: ', newRecipe)
    history.replace(`/recipes/${newRecipe.id}`)
  }

  const handleCreateIngredient = (index: number, amount: number, ingredient: Ingredient, unit: Unit): RecipeIngredient => {
    const newRecipeIngredients = recipe.ingredients.concat()
    const newIngredient = {
      amount,
      id: uuidv1(),
      index,
      ingredient,
      unit
    }
    newRecipeIngredients.push(newIngredient)

    const newRecipe = {...recipe, ingredients: newRecipeIngredients}
    setRecipe(newRecipe)

    return newIngredient
  }

  console.log('rerender @CreateRecipePage')
  return (
    <PageWithHeadingAndBreadcrumb
      title='Create new recipe'
      breadcrumbs={breadcrumbs}
    >
      <EditRecipeForm
        recipe={recipe}
        onCreateIngredient={handleCreateIngredient}
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
