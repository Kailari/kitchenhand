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

export const useField = ({ ...args }: FormInputProps, defaultValue: string = ''): Field => {
  const [value, setValue] = useState<string>(defaultValue)
  const [error, setError] = useState<string | null>(null)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value)
  }

  const reset = (): void => {
    setValue('')
    setError(null)
  }

  const elementArgs: FieldElementArgs = {
    ...args,
    value,
    onChange,
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

export interface FieldWithDirty extends Field {
  dirty: boolean,
  clearDirty: () => void,
}

export const useFieldWithDirty = ({ ...args }: FormInputProps, defaultValue: string = ''): FieldWithDirty => {
  const internalField = useField({ args }, defaultValue)
  const [dirty, setDirty] = useState<boolean>(false)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value
    if (internalField.value !== newValue) {
      setDirty(true)
    }

    internalField.onChange(event)
  }

  const elementArgs: FieldElementArgs = {
    ...args,
    value: internalField.value,
    onChange,
  }

  const clearDirty = (): void => setDirty(false)

  return {
    ...internalField,
    onChange,
    dirty,
    clearDirty,
    elementArgs,
  }
}
