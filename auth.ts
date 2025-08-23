import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id   // store id in JWT
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string // expose id to client
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Agar callbackUrl diya gaya hai (middleware se), wahi bhej
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
  },
},


)