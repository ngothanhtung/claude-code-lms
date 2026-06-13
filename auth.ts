import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { mockLogin } from "@/features/auth/mock/auth-mock"

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Tên đăng nhập", type: "text" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        const username = String(credentials?.username ?? "").trim()
        const password = String(credentials?.password ?? "")

        if (!username || !password) {
          return null
        }

        const result = await mockLogin(username, password)

        if (!result.success) {
          return null
        }

        return {
          id: username,
          name: result.user.name,
          email: `${username}@ames.local`,
        }
      },
    }),
  ],
})
