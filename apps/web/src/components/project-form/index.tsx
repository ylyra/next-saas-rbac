'use client'

import { AlertTriangle, Loader } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useFormState } from '@/hooks/useFormState'

import { createProjectAction } from './actions'

export default function ProjectForm() {
  const router = useRouter()
  const params = useParams<{
    slug: string
  }>()
  const [state, formAction, isPending] = useFormState(
    createProjectAction,
    undefined,
    (response) => {
      if (!params.slug || !response) {
        return
      }

      router.push(`/org/${params.slug}/project/${response.slug}`)
    },
  )

  return (
    <form className="w-full space-y-4" onSubmit={formAction}>
      {!state?.success && state?.message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>
            Saving Project failed. Please check the form and try again.
          </AlertTitle>
          <AlertDescription>
            <p>{state.message}</p>
          </AlertDescription>
        </Alert>
      )}

      {state?.success && state?.message && (
        <Alert variant="success">
          <AlertTriangle className="size-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            <p>{state.message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Project Name</Label>
        <Input id="name" name="name" autoFocus />

        {state.errors?.name && (
          <p className="text-xs text-destructive">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" />

        {state.errors?.description && (
          <p className="text-xs text-destructive">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader className="mr-2 size-4 animate-spin" />
            Saving Project...
          </>
        ) : (
          'Save Project'
        )}
      </Button>
    </form>
  )
}
