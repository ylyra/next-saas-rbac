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
import { signInWithEmailAndPassword } from './actions'

export function SignInForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useFormState(
    signInWithEmailAndPassword,
    undefined,
    () => {
      router.push('/')
    },
  )

  return (
    <div className="max-w-xs space-y-4">
      <form onSubmit={formAction} className="w-full space-y-4">
        {!state?.success && state?.message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>
              Sign in failed. Please check the form and try again.
            </AlertTitle>
            <AlertDescription>
              <p>{state.message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name="email" required autoFocus />

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

          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium text-foreground underline-offset-4 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader className="mr-2 size-4 animate-spin" /> Submiting...{' '}
            </>
          ) : (
            'Sign in with email'
          )}
        </Button>

        <Button variant="link" className="w-full" size="sm" asChild>
          <Link href="/auth/sign-up">Don't have an account? Sign up</Link>
        </Button>
      </form>

      <Separator className="" />

      <form action={signInWithGithub}>
        <Button className="w-full" variant="outline">
          <Image src={githubIcon} alt="" className="mr-2 size-4 dark:invert" />
          Sign in with GitHub
        </Button>
      </form>
    </div>
  )
}
