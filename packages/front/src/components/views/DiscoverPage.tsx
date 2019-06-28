import React, { FunctionComponent } from 'react'
import { Header, Segment, Item, Loader, Icon } from 'semantic-ui-react'

import { RecipesQuery, NEW_RECIPES, TRENDING_RECIPES } from '../recipes/RecipesQuery'
import Carousel from '../Carousel'
import RecipeCard from '../recipes/RecipeCard'
import { PageWithHeadingAndBreadcrumb, PageWithBreadcrumbsProps } from './PageBase'

const Discover: FunctionComponent<PageWithBreadcrumbsProps> = ({ breadcrumbs }) => (
  <PageWithHeadingAndBreadcrumb title='Discover new recipes' breadcrumbs={breadcrumbs}>
    <Header as='h2'>
      <Icon name='food' />
      New and Fresh
    </Header>
    <Segment color='olive' stacked style={{ paddingBottom: 0 }}>
      <RecipesQuery query={NEW_RECIPES} render={(result) => result.loading || !result.data || !result.data.recipes
        ? <Loader active inline='centered'>Loading...</Loader>
        : <Carousel
          elementKeyMapper={(recipe) => recipe.id}
          elements={result.data.recipes.reverse().slice(0, Math.min(result.data.recipes.length, 5))} render={
            (recipe) => <Item.Group><RecipeCard recipe={recipe} /></Item.Group>
          } />
      } />
    </Segment>
    <Header as='h2'>
      <Icon name='fire' />
      What others are cooking
    </Header>
    <Segment color='olive' stacked>
      <RecipesQuery query={TRENDING_RECIPES} render={(result) => result.loading || !result.data || !result.data.recipes
        ? <Loader active inline='centered'>Loading...</Loader>
        : <Carousel
          elementKeyMapper={(recipe) => recipe.id}
          elements={result.data.recipes.slice(0, Math.min(result.data.recipes.length, 5))} render={
            (recipe) => <Item.Group><RecipeCard recipe={recipe} /></Item.Group>
          } />
      } />
    </Segment>
  </PageWithHeadingAndBreadcrumb>
)

export default Discover
