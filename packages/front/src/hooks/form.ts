import React, { useState } from 'react'
import { FormInputProps } from 'semantic-ui-react'

export interface Field {
  value: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  error: string | null,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  reset: () => void,
  elementArgs: FieldElementArgs,
}

export interface FieldElementArgs extends FormInputProps {
  value: string,
}

export const useField = ({ ...args }: FormInputProps): Field => {
  const [value, setValue] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  if (args.onChange) {
    throw new Error('Tried overriding useField onChange')
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value)
  }

  const reset = (): void => {
    setValue('')
    setError(null)
  }

  const elementArgs: FieldElementArgs = {
    value,
    onChange,
    ...args
  }

  return {
    value,
    onChange,
    error,
    setError,
    reset,
    elementArgs
  }
}
