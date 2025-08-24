"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function ThankYouPage() {
    const router = useRouter();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>

          {/* Main Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">Test Submitted Successfully!</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Thank you for completing the test. Your Test have been Submitted Successfully.
            </p>
          </div>

          {/* Additional Info */}
          <div className="w-full p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              You can now close this window or navigate back to the main page. 
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button variant="default" className="flex-1" onClick={() => (router.push("/dashboard"))}>
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
