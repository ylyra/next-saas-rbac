import OrganizationForm from './organization-form'

export default async function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create Organization</h1>

      <OrganizationForm />
    </div>
  )
}
