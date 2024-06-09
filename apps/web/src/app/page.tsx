import { auth } from '@/auth/auth'

export default async function Home() {
  const user = await auth()
  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}
