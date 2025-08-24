"use client"

import * as React from "react"
import {
  
  LayoutDashboard, FileQuestion, ListChecks,
  BookOpenCheck,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"

const team = {
      name: "SnapTest",
      logo: BookOpenCheck,
      plan: "Create, share, challenge.",
    }

// This is sample data.
const tabs = [
    {
      title: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Tests",
      url: "/dashboard/tests",
      icon: FileQuestion,
      isActive: true,

    },
    {
      title: "Responses",
      url: "/dashboard/responses",
      icon: ListChecks,
    },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    // },
  ]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const user = session?.user
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={team} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={tabs} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
          <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
