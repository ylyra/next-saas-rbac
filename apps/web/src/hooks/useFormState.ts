/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FormEvent, useState, useTransition } from 'react'
import { requestFormReset } from 'react-dom'

interface FormState {
  data?: Record<string, any>
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export function useFormState<TFormState extends FormState>(
  action: (data: FormData) => Promise<TFormState>,
  initialState?: TFormState,
  onSucess?: (response?: TFormState['data']) => void | Promise<void>,
) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState(
    initialState ?? {
      success: false,
      message: null,
      errors: null,
    },
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const result = await action(data)

      if (result.success) {
        requestFormReset(form)
      }

      if (onSucess && result.success) {
        await onSucess(result.data)
      }

      setState(result)
    })
  }

  return [state, handleSubmit, isPending] as const
}
