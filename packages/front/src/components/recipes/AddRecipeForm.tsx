import React, { FunctionComponent } from 'react'
import { Form, Segment, Button } from 'semantic-ui-react'
import { useField } from '../../hooks/form'

interface AddRecipeFormProps {
  onCreate: (name: string, description: string) => void,
}

const AddRecipeForm: FunctionComponent<AddRecipeFormProps> = ({ onCreate }) => {
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

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await onCreate(nameField.value, descriptionField.value)
    } catch (error) {
      console.log(error)
    }
  }

  console.log('Rendering@AddRecipeForm')
  return (
    <Form size='large' onSubmit={submit}>
      <Segment stacked>
        <Form.Field {...nameField.elementArgs} />
        <Form.Field {...descriptionField.elementArgs} />
        <Button type='submit'>Create</Button>
      </Segment>
    </Form>
  )
}

export default AddRecipeForm
