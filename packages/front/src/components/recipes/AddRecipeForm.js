import React from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Container, Header, Segment, Button } from 'semantic-ui-react'
import { useField } from '../../hooks/form'

const AddRecipeForm = ({ history, create }) => {
  const nameField = useField({
    control: Form.Input,
    type: 'text',
    label: 'Name',
    placeholder: 'My awesome recipe',
  })
  const descriptionField = useField({
    control: Form.Input,
    label: 'Description',
    type: 'text',
    placeholder: 'A short one-line description of your recipe',
  })

  const submit = async (e) => {
    e.preventDefault()

    try {
      /*const addedRecipe =*/ await create({
        variables: {
          name: nameField.value,
          description: descriptionField.value,
        }
      })

      history.push('/recipes/discover')
    } catch (error) {
      console.log(error)
    }
  }

  console.log('Rendering@AddRecipeForm')
  return (
    <Container style={{ height: '100vh' }}>
      <Header as='h1'>Create a new recipe</Header>
      <Form size='large' onSubmit={submit}>
        <Segment stacked>
          <Form.Field {...nameField.elementArgs} />
          <Form.Field {...descriptionField.elementArgs} />
          <Button onClick={submit}>
            Create
          </Button>
        </Segment>
      </Form>
    </Container>
  )
}

export default withRouter(AddRecipeForm)