import { useState } from 'react'

export const useField = ({ ...args }) => {
  const [value, setValue] = useState('')
  const [error, setError] = useState(null)

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
    setError(null)
  }

  const elementArgs = {
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
