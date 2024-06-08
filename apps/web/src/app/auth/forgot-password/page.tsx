import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Page() {
  return (
    <form className="w-full max-w-xs space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" name="email" required autoFocus />
      </div>

      <Button type="submit" className="w-full">
        Recover password
      </Button>

      <Button variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/sign-in">Back to sign in</Link>
      </Button>
    </form>
  )
}
