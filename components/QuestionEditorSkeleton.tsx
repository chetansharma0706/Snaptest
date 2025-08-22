import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function QuestionEditorSkeleton() {
  return (
    <div className="flex-1 px-6 py-8">
      <div className="max-w-4xl mx-auto relative">

        <Card className="skeleton bg-black border-0 shadow-sm">
          <CardContent className="p-8 space-y-6">
            {/* Question header */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>

            {/* Question textarea */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-[100px] w-full rounded-md" />
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-9 w-full rounded-md" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-3 w-56" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Navigation */}
      <footer className="border-t border-border px-6 py-4 mt-6">
        <div className="max-w-6xl mx-auto space-y-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[...Array(20)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-8 min-w-[40px] rounded-md"
              />
            ))}
            <Skeleton className="h-8 min-w-[40px] rounded-md" />
          </div>
          <Skeleton className="h-3 w-48" />
        </div>
      </footer>
    </div>
  )
}
