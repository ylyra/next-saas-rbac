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
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required autoFocus />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" name="email" required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" name="password" required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirm_password">Confirm your password</Label>
        <Input
          id="confirm_password"
          name="confirm_password"
          type="password"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Create account
      </Button>

      <Button variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/sign-in">Already have an account? Sign in</Link>
      </Button>

      <Separator className="" />

      <Button className="w-full" variant="outline">
        <Image src={githubIcon} alt="" className="mr-2 size-4 dark:invert" />
        Sign up with GitHub
      </Button>
    </form>
  )
}
