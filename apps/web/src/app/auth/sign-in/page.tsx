import Image from 'next/image'
import Link from 'next/link'

import githubIcon from '@/assets/svgs/github-icon.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function Page() {
  return (
    <form className="w-full max-w-xs space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" name="email" required autoFocus />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" name="password" required />

        <Link
          href="/auth/forgot-password"
          className="text-xs font-medium text-foreground underline-offset-4 hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      <Button type="submit" className="w-full">
        Sign in with email
      </Button>

      <Button variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/sign-up">Don't have an account? Sign up</Link>
      </Button>

      <Separator className="" />

      <Button className="w-full" variant="outline">
        <Image src={githubIcon} alt="" className="mr-2 size-4 dark:invert" />
        Sign in with GitHub
      </Button>
    </form>
  )
}
