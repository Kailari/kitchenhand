import React, { FunctionComponent } from 'react'
import { Loader } from 'semantic-ui-react'

import { PageWithHeadingAndBreadcrumb, PageWithBreadcrumbsProps } from './PageBase'
import { RecipesQuery, MY_RECIPES } from '../recipes/RecipesQuery'
import RecipeList from '../recipes/RecipeList'

const CookbookPage: FunctionComponent<PageWithBreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <PageWithHeadingAndBreadcrumb title='My recipes' breadcrumbs={breadcrumbs}>
      <RecipesQuery query={MY_RECIPES} render={(result) =>
        result.loading || !result.data
          ? <Loader active inline>Loading recipes...</Loader>
          : <RecipeList recipes={result.data.recipes} />} />
    </PageWithHeadingAndBreadcrumb>
  )
}
export default CookbookPage
