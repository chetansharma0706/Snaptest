"use server"
import { signIn , signOut } from "@/auth";
export async function loginWithGoogle() {
    await signIn('google', { redirectTo:"/dashboard"})
}

export async function logOut() {
    await signOut({ redirectTo:"/"})
}

