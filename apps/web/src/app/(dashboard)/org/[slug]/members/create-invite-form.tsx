'use client'

import { AlertTriangle, Loader, UserPlus } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFormState } from '@/hooks/useFormState'

import { createInviteAction } from './actions'

export function CreateInviteForm() {
  const [state, formAction, isPending] = useFormState(
    createInviteAction,
    undefined,
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

      <div className="flex items-start gap-2">
        <div className="flex-1 space-y-1">
          <Input
            id="email"
            name="email"
            autoFocus
            type="email"
            placeholder="john@example.com"
          />

          {state.errors?.email && (
            <p className="text-xs text-destructive">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <Select defaultValue="MEMBER" name="role">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MEMBER">Member</SelectItem>
              <SelectItem value="BILLING">Billing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader className="mr-2 size-4 animate-spin" />
              Inviting...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 size-4" />
              Invite user
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
