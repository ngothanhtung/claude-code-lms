"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { mockLogin } from "@/features/auth/mock/auth-mock"

export function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      toast.error("Vui lòng nhập tên đăng nhập và mật khẩu")
      return
    }

    setLoading(true)

    const result = await mockLogin(username.trim(), password)

    if (result.success) {
      router.push("/dashboard")
    } else {
      toast.error(result.error)
      setPassword("")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>Nhập thông tin tài khoản để tiếp tục</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <LoaderCircle className="size-4 animate-spin" />}
            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
          </Button>

          <div className="flex w-full items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Quên mật khẩu?
            </Link>
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Chưa có tài khoản? Đăng ký
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
