export default function LoadingScreen({ message }: { message?: string }) {
  return (
    <div className="flex flex-col gap-6 justify-center items-center fixed inset-0 bg-black/20 z-50 h-screen">
      <div
        className="inline-block h-10 w-10 animate-[spin_0.5s_linear_infinite] rounded-full border-4 border-solid border-primary/70 border-r-transparent align-[-0.125em]"
        role="status"
      >
        
      </div>

      <p className="text-sm md:text-lg text-foreground">{message || "Loading..."}</p>
    </div>
  )
}
