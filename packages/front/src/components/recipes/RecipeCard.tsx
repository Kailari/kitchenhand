import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { Item, Reveal, Grid, Icon, SemanticICONS } from 'semantic-ui-react'
import { Recipe } from '../MainApp';

interface RevealColumnProps {
  text?: string,
  defaultText: string,
  hiddenText: string,
  icon: SemanticICONS,
}

const RevealColumn: FunctionComponent<RevealColumnProps> = ({ text, defaultText, hiddenText, icon }) => {
  // TODO: Styles to .css
  return (
    <Reveal as={Grid.Column} animated='fade' style={{ padding: '0.5em' }}>
      <Reveal.Content visible style={{ userSelect: 'none', backgroundColor: 'white', width: '100%' }}>
        <Icon name={icon} /> {text || <span>{defaultText}</span>}
      </Reveal.Content>
      <Reveal.Content hidden style={{ userSelect: 'none' }}>
        {hiddenText}
      </Reveal.Content>
    </Reveal>
  )
}

interface RecipeCardProps {
  recipe: Recipe,
}

const RecipeCard: FunctionComponent<RecipeCardProps> = ({ recipe }) => (
  <Item>
    <Item.Content>
      <Item.Header as='h3'>
        <Link to={`/recipe/${recipe.id}`}>{recipe.name}</Link>
      </Item.Header>
      <Item.Meta as={Grid} divided columns='equal' textAlign='center' verticalAlign='middle'>
        <RevealColumn
          text={recipe.category}
          defaultText='N/A'
          hiddenText='Category'
          icon='book'
        />
        <RevealColumn
          text={`${recipe.views}`}
          defaultText='0'
          hiddenText='Views'
          icon='eye'
        />
        <RevealColumn
          text={`${recipe.date}`}
          defaultText='Unknown'
          hiddenText='Date added'
          icon='calendar'
        />
      </Item.Meta>
      <Item.Description>
        {recipe.description || 'No description available'}
      </Item.Description>
      <Item.Extra>
        Added by {recipe.owner ? recipe.owner.name : 'Unknown'}
      </Item.Extra>
    </Item.Content>
  </Item>
)

export default RecipeCard
