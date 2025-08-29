"use client"
import { BookOpenCheck, Link, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

export default function Header() {
 const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="w-full border-b border-gray-900/10">
      <div className="mx-auto max-w-6xl h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpenCheck className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">SnapTest</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="cursor-pointer h-9 rounded-full"
          >
            {resolvedTheme === "dark" ? (
              <>
                <Sun className="w-4 h-4" />
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}