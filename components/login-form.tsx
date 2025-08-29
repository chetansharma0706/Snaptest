"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { loginWithGoogle  } from "@/lib/auth"
import { FaGoogle } from "react-icons/fa"
import { useSearchParams } from "next/navigation";
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

   const searchParams = useSearchParams();
const callbackUrl = searchParams.get("callbackUrl") ?? undefined;
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} action={()=>loginWithGoogle(callbackUrl)}>
      <div className="block lg:hidden flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Get started instantly.</h1>
        <p className="text-muted-foreground text-sm text-balance">
         Snap your first test today.
        </p>
      </div>
      
        <Button type="submit" className="w-full cursor-pointer">
         <FaGoogle size={22}/>
          Continue with Google
        </Button>
    </form>
  )                           
}
