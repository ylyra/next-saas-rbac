'use client'

import { AlertTriangle, Loader } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import githubIcon from '@/assets/svgs/github-icon.svg'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/useFormState'

import { signInWithGithub } from '../actions'
import { signUpWithEmailAndPassword } from './actions'

export default function SignUpForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useFormState(
    signUpWithEmailAndPassword,
    undefined,
    () => {
      router.push('/auth/sign-in')
    },
  )

  return (
    <div className="max-w-xs space-y-4">
      <form className="w-full space-y-4" onSubmit={formAction}>
        {!state?.success && state?.message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign in failed!</AlertTitle>
            <AlertDescription>
              <p>{state.message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required autoFocus />

          {state.errors?.name && (
            <p className="text-xs text-destructive">{state.errors.name[0]}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" name="email" required />

          {state.errors?.email && (
            <p className="text-xs text-destructive">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" name="password" required />

          {state.errors?.password && (
            <p className="text-xs text-destructive">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirm_password">Confirm your password</Label>
          <Input
            id="confirm_password"
            name="confirm_password"
            type="password"
            required
          />

          {state.errors?.confirm_password && (
            <p className="text-xs text-destructive">
              {state.errors.confirm_password[0]}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader className="mr-2 size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>

        <Button variant="link" className="w-full" size="sm" asChild>
          <Link href="/auth/sign-in">Already have an account? Sign in</Link>
        </Button>
      </form>

      <Separator className="" />

      <form action={signInWithGithub}>
        <Button className="w-full" variant="outline">
          <Image src={githubIcon} alt="" className="mr-2 size-4 dark:invert" />
          Sign up with GitHub
        </Button>
      </form>
    </div>
  )
}
