"use server"
import { signIn , signOut } from "@/auth";
export async function loginWithGoogle(callbackUrl?: string) {
    await signIn('google', { redirectTo: callbackUrl || "/dashboard"})
}

export async function logOut() {
    await signOut({ redirectTo:"/"})
}

