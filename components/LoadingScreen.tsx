export default function LoadingScreen({ message }: { message?: string }) {
  return (
    <div className="flex flex-col gap-6 justify-center items-center h-screen">
      <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></span>
      <p className="text-sm md:text-lg text-muted-foreground">{message || "Loading..."}</p>
    </div>
  )
}
