import { auth } from "@/auth"
import { AppSidebar } from "@/components/app-sidebar"
import SideBarSlideToggle from "@/components/SideBarSlideToggle"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { redirect } from "next/navigation"
import * as React from "react"


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  // const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
  

  const session = await auth()
  if (!session) {
    console.log("user doesn't exist")
    return redirect("/")
  }

  // let startX: number | null = null
  
  //   const handleTouchStart = (e: React.TouchEvent) => {
  //     startX = e.touches[0].clientX
  //   }
  
  //   const handleTouchMove = (e: React.TouchEvent) => {
  //     if (startX === null) return
  //     const currentX = e.touches[0].clientX
  //     const diff = currentX - startX
  
  //     // If swipe left more than 80px → close sidebar
  //     if (diff < -80) {
  //       setOpenMobile(false)
  //       startX = null
  //     }
  //   }


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {children}
        <SideBarSlideToggle />
      </SidebarInset>
    </SidebarProvider>
  )
}
