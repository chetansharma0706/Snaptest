import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { loginWithGoogle  } from "@/lib/auth"
import { FcGoogle } from "react-icons/fc";
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} action={loginWithGoogle}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      
        <Button variant="outline" type="submit" className="w-full cursor-pointer">
         <FcGoogle size={22}/>
          Login with Google
        </Button>
    </form>
  )
}
