import { LoginForm } from "@/components/login-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { FeatureCard } from "@/components/feature-card";
import Header from "@/components/Header";
import { BookOpenCheck } from "lucide-react";


export default async function LoginPage() {
  const session = await auth();
  if(session){
    console.log("user exist")
    return redirect("/dashboard")
  }
  return (
    // <div className="grid min-h-svh lg:grid-cols-2">
    //   <div className="flex flex-col gap-4 p-6 md:p-10">
    //     <div className="flex justify-center gap-2 md:justify-start">
    //       <a href="#" className="flex items-center gap-2 font-medium">
    //         <div className="flex size-6 items-center justify-center rounded-md">
    //          <BookOpenCheck />
    //         </div>
    //         <span className="text-2xl font-semibold">SnapTest</span>
    //       </a>
    //     </div>
    //     <div className="flex flex-1 items-center justify-center">
    //       <div className="w-full max-w-xs">
    //         <LoginForm />
    //       </div>
    //     </div>
    //   </div>
    //   <div className="bg-muted relative hidden lg:block">
    //     <img
    //       src="https://plus.unsplash.com/premium_photo-1668736594225-55e292fdd95e?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //       alt="Image"
    //       className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
    //     />
    //   </div>
    // </div>
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-pretty text-4xl md:text-5xl font-semibold leading-tight flex items-center gap-2"><BookOpenCheck className="w-7 h-7 md:w-10 md:h-10 text-primary"/> SnapTest</h1>
              <p className="text-xl md:text-2xl">AI-powered Online Test Platform</p>

              <p className="leading-relaxed">
               SnapTest is an AI-powered platform that helps teachers create and share online tests in minutes.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-base text-foreground/80">
                <li>
                  Prevents cheating by resetting the test if students switch tabs.
                </li>
                <li>
                  Gives teachers instant performance reports.
                </li>
                <li>
                  Already used by college teachers to make exams faster, fairer, and more reliable.
                </li>
              </ul>
              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <LoginForm />     
              </div>

              <div className="text-sm text-foreground/70">
                No credit card required. Get started in seconds.
                </div>
            </div>

            <div className="relative">
              <div className="rounded-xl border border-gray-900/10 shadow-sm overflow-hidden">
                <Image
                  src="/quizMaker_illus.png"
                  alt="Illustration representing AI-powered testing"
                  width={1200}
                  height={900}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="highlights" className="px-6 pt-6 pb-12 md:pb-16 md:pt-10 ">
          <div className="mx-auto max-w-6xl">
            <h2 id="highlights" className="text-balance text-2xl md:text-3xl font-semibold">
              Why SnapTest?
            </h2>
            <p className="mt-2 max-w-2xl">
              A modern assessment platform designed for security, speed, and real-world classroom impact.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                title="AI-generated tests"
                description="Generate MCQs instantly with AI, or create them manually for full control."
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M11 2l1.8 4.6L17 8l-4.2 1.4L11 14l-1.8-4.6L5 8l4.2-1.4L11 2zm7 6l1.2 3.1L22 12l-2.8.9L18 16l-1.2-3.1L14 12l2.8-.9L18 8zM6 14l1 2.6L10 18l-3 1-1 3-1-3-3-1 3-1.4L6 14z"
                    />
                  </svg>
                }
              />
              <FeatureCard
                title="Anti-cheating system"
                description="Tab-switch detection resets tests to help preserve exam integrity."
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 2l7 3v6c0 5-3.8 9.7-7 11-3.2-1.3-7-6-7-11V5l7-3zm0 4.2L7 7v4.8c0 3.8 2.7 7.9 5 9 2.3-1.1 5-5.2 5-9V7l-5-0.8z"
                    />
                  </svg>
                }
              />
              <FeatureCard
                title="Performance reports"
                description="Get insights on student outcomes with clear, actionable analytics."
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M3 3h2v18H3V3zm16 6h2v12h-2V9zM9 13h2v8H9v-8zm8-10h2v6h-2V3zM15 7h2v14h-2V7zM7 11h2v10H7V11z"
                    />
                  </svg>
                }
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}




function Footer() {
  return (
    <footer className="w-full border-t border-gray-900/10">
      <div className="mx-auto max-w-6xl px-6 h-16 flex flex-col sm:flex-row items-center justify-between text-sm text-foreground/80 gap-1">
        <p className="text-xs md:text-sm mt-2">Made with ❤️ in India. Loved by Teachers Everywhere.</p>
        <p  className="text-xs md:text-sm">© {new Date().getFullYear()} SnapTest. All rights reserved.</p>
      </div>
    </footer>
  )
}
