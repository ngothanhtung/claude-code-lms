import { NextResponse } from "next/server"
import { auth } from "@/auth"

const publicRoutes = new Set([
  "/login",
  "/login-student",
  "/register",
  "/forgot-password",
])

export default auth((request) => {
  const { nextUrl } = request
  const isAuthenticated = Boolean(request.auth)
  const isPublicRoute = publicRoutes.has(nextUrl.pathname)

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  if (!isAuthenticated && !isPublicRoute) {
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
