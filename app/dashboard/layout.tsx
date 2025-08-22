import { auth } from "@/auth"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { redirect } from "next/navigation"
import * as React from "react"


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  const session = await auth()
  if (!session) {
    console.log("user doesn't exist")
    return redirect("/")
  }


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {children}
        
      </SidebarInset>
    </SidebarProvider>
  )
}
