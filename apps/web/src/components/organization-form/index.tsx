'use client'

import { AlertTriangle, Loader } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/useFormState'

import { createOrganizationAction } from './actions'

export default function OrganizationForm() {
  const [state, formAction, isPending] = useFormState(
    createOrganizationAction,
    undefined,
  )

  return (
    <form className="w-full space-y-4" onSubmit={formAction}>
      {!state?.success && state?.message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>
            Saving Organization failed. Please check the form and try again.
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
        <Label htmlFor="name">Organization Name</Label>
        <Input id="name" name="name" autoFocus />

        {state.errors?.name && (
          <p className="text-xs text-destructive">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="domain">E-mail domain</Label>
        <Input
          id="domain"
          name="domain"
          inputMode="url"
          placeholder="example.com"
        />

        {state.errors?.domain && (
          <p className="text-xs text-destructive">{state.errors.domain[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Checkbox
            name="shouldAttachUsersByDomain"
            id="shouldAttachUsersByDomain"
          />
          <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
            <span className="text-sm font-medium leading-none">
              Auto-join new members
            </span>
            <p className="text-sm text-muted-foreground">
              This will automatically join new members to your organization if
              they have an e-mail address that matches the domain you specified
              above.
            </p>
          </label>
        </div>

        {state.errors?.shouldAttachUsersByDomain && (
          <p className="text-xs text-destructive">
            {state.errors.shouldAttachUsersByDomain[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader className="mr-2 size-4 animate-spin" />
            Saving Organization..
          </>
        ) : (
          'Save Organization'
        )}
      </Button>
    </form>
  )
}
