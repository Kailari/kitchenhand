import { useState } from 'react'

export type Consumer<TValue> = (value: TValue) => void
export type StateWithDelayedCallbackSetDispatch<TValue> = Consumer<TValue>

export const useStateWithDelayedCallback = function <TValue>(defaultValue?: TValue, callback?: Consumer<TValue>, timeout: number = 1000): [TValue | undefined, StateWithDelayedCallbackSetDispatch<TValue>] {
  const [state, setState] = useState<TValue | undefined>(defaultValue)
  const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout>()

  const updateState = (value: TValue): void => {
    if (callback) {
      if (updateTimeout) clearTimeout(updateTimeout)
      setUpdateTimeout(setTimeout((): void => callback(value), timeout))
    }
    setState(value)
  }

  return [
    state,
    updateState,
  ]
}
