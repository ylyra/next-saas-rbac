import { InterceptedSheet } from '@/components/intercepted-sheet'
import OrganizationForm from '@/components/organization-form'
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export default function Page() {
  return (
    <InterceptedSheet>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create organization</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <OrganizationForm />
        </div>
      </SheetContent>
    </InterceptedSheet>
  )
}
