import { NextResponse } from "next/server"
import { auth } from "@/auth"

// NextAuth routes that need auth middleware
const nextAuthRoutes = new Set([
  "/login",
  "/login-student",
  "/register",
  "/forgot-password",
])

export default auth((request) => {
  const { nextUrl } = request
  const isAuthenticated = Boolean(request.auth)
  const isNextAuthRoute = nextAuthRoutes.has(nextUrl.pathname)
  const isStudentRoute = nextUrl.pathname.startsWith("/elementary-student/")

  // Elementary student routes: bypass NextAuth, handled by session context
  if (isStudentRoute) {
    return NextResponse.next()
  }

  // NextAuth routes: redirect authenticated users away
  if (isAuthenticated && isNextAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // Non-student, non-auth routes: require authentication
  if (!isAuthenticated && !isNextAuthRoute) {
    const loginUrl = new URL("/login", nextUrl)
    loginUrl.searchParams.set(
      "callbackUrl",
      `${nextUrl.pathname}${nextUrl.search}`
    )
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
