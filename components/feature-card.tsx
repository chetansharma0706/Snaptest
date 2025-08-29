import type React from "react"

export function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-gray-900/10 bg-card shadow-sm p-5">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center">{icon}</div>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
