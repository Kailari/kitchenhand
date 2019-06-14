import React from 'react'
import { Container, Item, Header, Icon, Grid, Reveal } from 'semantic-ui-react';
import { Link } from 'react-router-dom'

const RevealColumn = ({ text, defaultText, hiddenText, icon }) => {
  // TODO: Styles to .css
  return (
    <Reveal as={Grid.Column} animated='fade' style={{ padding: '0.5em' }}>
      <Reveal.Content visible style={{ userSelect: 'none', backgroundColor: 'white', width: '90%' }}>
        <Icon name={icon} /> {text || <span>{defaultText}</span>}
      </Reveal.Content>
      <Reveal.Content hidden style={{ userSelect: 'none' }}>
        {hiddenText}
      </Reveal.Content>
    </Reveal>
  )
}

const RecipeList = ({ result }) => {
  if (result.loading) {
    return (<div>Loading...</div>)
  }

  const recipes = result.data.allRecipes
  return (
    <Container>
      <Header as='h1'>List of all recipes:</Header>
      <Item.Group divided>
        {recipes.map(r =>
          <Item key={r.id}>
            <Item.Content>
              <Item.Header as={Link} to={`/recipe/${r.id}`}>
                {r.name}
              </Item.Header>
              <Item.Meta as={Grid} divided columns='equal' textAlign='center' verticalAlign='middle'>
                <RevealColumn
                  text={r.category}
                  defaultText='N/A'
                  hiddenText='Category'
                  icon='book'
                />
                <RevealColumn
                  text={r.views}
                  defaultText='0'
                  hiddenText='Views'
                  icon='eye'
                />
                <RevealColumn
                  text={r.date}
                  defaultText='Unknown'
                  hiddenText='Date added'
                  icon='calendar'
                />
              </Item.Meta>
              <Item.Description>
                {r.description || <span>No description available</span>}
              </Item.Description>
              <Item.Extra>
                Added by {r.owner ? r.owner.name : <span>Unknown</span>}
              </Item.Extra>
            </Item.Content>
          </Item>
        )}
      </Item.Group>
    </Container>
  )
}

export default RecipeList