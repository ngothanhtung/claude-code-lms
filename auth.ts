import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase/firestore"

declare module "next-auth" {
  interface User {
    roles?: string[]
    schoolId?: string
  }
  interface Session {
    user: {
      id?: string
      roles?: string[]
      schoolId?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    roles?: string[]
    schoolId?: string
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase()
        const password = String(credentials?.password ?? "")

        if (!email || !password) return null

        try {
          const q = query(collection(db, "users"), where("email", "==", email))
          const snapshot = await getDocs(q)

          if (snapshot.empty) return null

          const userDoc = snapshot.docs[0]
          const userData = userDoc.data()

          if (userData.password !== password) return null

          return {
            id: userDoc.id,
            name: userData.name,
            email: userData.email,
            roles: userData.roles ?? [],
            schoolId: userData.schoolId ?? "",
          }
        } catch (err) {
          console.error("Auth error:", err)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roles = user.roles
        token.schoolId = user.schoolId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.roles = token.roles
        session.user.schoolId = token.schoolId
      }
      return session
    },
  },
})
