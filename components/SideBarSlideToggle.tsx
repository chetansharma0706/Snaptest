"use client"

import { useSidebar } from "./ui/sidebar"
import { useRef } from "react"

export default function SideBarSlideToggle() {
  const { setOpenMobile } = useSidebar()

  // we use a ref so startX doesn't reset on re-renders
  const startXRef = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current === null) return
    const currentX = e.touches[0].clientX
    const diff = currentX - startXRef.current


    // If swipe right more than 80px → open sidebar
    if (diff > 80) {
      setOpenMobile(true)
      startXRef.current = null
    }
  }

  return (
    <div
       className="fixed bottom-0 left-0 h-2/3 w-[50px] z-50"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* you can add children here */}
    </div>
  )
}
