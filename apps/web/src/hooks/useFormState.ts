import { type FormEvent, useState, useTransition } from 'react'

interface FormState {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export function useFormState<TFormState extends FormState>(
  action: (data: FormData) => Promise<TFormState>,
  initialState?: TFormState,
  onSucess?: () => void | Promise<void>,
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

      if (onSucess && result.success) {
        await onSucess()
      }

      setState(result)
    })
  }

  return [state, handleSubmit, isPending] as const
}
