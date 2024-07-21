import { InterceptedSheet } from '@/components/intercepted-sheet'
import ProjectForm from '@/components/project-form'
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export default function Page() {
  return (
    <InterceptedSheet>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Project</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <ProjectForm />
        </div>
      </SheetContent>
    </InterceptedSheet>
  )
}
