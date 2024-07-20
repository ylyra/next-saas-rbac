'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronsUpDown, Loader, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { getProjects } from '@/http/get-projects'
import { getInitials } from '@/utils/get-initials'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Skeleton } from './ui/skeleton'

function Project({
  project,
}: {
  project: {
    avatarUrl: string | null
    name: string
  }
}) {
  return (
    <>
      <Avatar className="size-4">
        {project.avatarUrl && <AvatarImage src={project.avatarUrl} alt="" />}
        <AvatarFallback className="text-[8px]">
          {getInitials(project.name)}
        </AvatarFallback>
      </Avatar>
      <span className="truncate">{project.name}</span>
    </>
  )
}

export function ProjectSwitcher() {
  const params = useParams<{
    slug: string
    project_slug?: string
  }>()
  const orgSlug = params?.slug
  const projectSlug = params?.project_slug
  const { data, isLoading } = useQuery({
    queryKey: [orgSlug, 'projects'],
    queryFn: () => getProjects(orgSlug),
    enabled: !!orgSlug,
  })
  const currentProject = data?.projects.find(
    (project) => project.slug === projectSlug,
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex w-[168px] items-center gap-2 rounded p-1 text-left text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-4 flex-1" />
          </>
        ) : (
          <>
            {currentProject ? (
              <Project project={currentProject} />
            ) : (
              <span className="text-muted-foreground">Select project</span>
            )}
          </>
        )}

        {isLoading ? (
          <Loader className="ml-auto size-4 shrink-0 animate-spin text-muted-foreground" />
        ) : (
          <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
        alignOffset={-16}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>

          {data?.projects.map((project) => (
            <DropdownMenuItem key={project.id} asChild>
              <Link
                href={`/org/${orgSlug}/project/${project.slug}`}
                className="space-x-2"
              >
                <Project project={project} />
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/org/${orgSlug}/create-project`}>
            <PlusCircle className="mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
