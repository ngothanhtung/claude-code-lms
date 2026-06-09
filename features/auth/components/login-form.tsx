"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowRight,
  CalendarClock,
  Gamepad2,
  GraduationCap,
  Languages,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  UserRound,
  Volume2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockLogin } from "@/features/auth/mock/auth-mock"

const featuredFeatures = [
  {
    title: "Bài học sinh động",
    description:
      "Hình ảnh, âm thanh và nhân vật gần gũi với học sinh tiểu học.",
    className:
      "border-primary/25 bg-linear-to-br from-primary-muted via-background to-primary/10",
    accentClassName: "bg-primary",
  },
  {
    title: "Học tập theo nhóm",
    description: "Thi đua học tập, cạnh tranh điểm số, cùng nhau thăng hạng.",
    className:
      "border-warning/25 bg-linear-to-br from-warning-muted via-background to-warning/10",
    accentClassName: "bg-warning",
  },
  {
    title: "Theo dõi tiến bộ",
    description: "Phụ huynh nắm được kết quả sau từng chặng học.",
    className:
      "border-success/25 bg-linear-to-br from-success-muted via-background to-success/10",
    accentClassName: "bg-success",
  },
]

const englishLearningItems = [
  {
    icon: Languages,
    title: "Từ vựng theo chủ đề",
    meta: "Gia đình, trường học, màu sắc và con vật",
  },
  {
    icon: Volume2,
    title: "Nghe nói cùng nhân vật",
    meta: "Bài học ngắn, giọng đọc chậm và dễ bắt chước",
  },
  {
    icon: Gamepad2,
    title: "Trò chơi luyện tập",
    meta: "Nhận sao thưởng sau mỗi nhiệm vụ hoàn thành",
  },
]

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

    try {
      const result = await mockLogin(username.trim(), password)

      if (result.success) {
        router.push("/dashboard")
      } else {
        toast.error(result.error)
        setPassword("")
      }
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
      setPassword("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-svh overflow-hidden bg-[radial-gradient(circle_at_18%_12%,hsl(var(--primary)/0.13),transparent_28%),radial-gradient(circle_at_82%_82%,hsl(var(--success)/0.12),transparent_24%),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)))] px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100svh-48px)] w-full max-w-6xl items-center">
        <div className="relative w-full lg:perspective-[1800px]">
          <div className="pointer-events-none absolute -inset-x-4 bottom-4 hidden h-10 rounded-[50%] bg-foreground/10 blur-2xl lg:block" />
          <div className="relative grid w-full overflow-hidden rounded-md border border-border bg-card shadow-[0_24px_70px_-42px_hsl(222_47%_11%/0.3)] lg:min-h-165 lg:grid-cols-2">
            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-14 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,hsl(var(--foreground)/0.035)_24%,hsl(var(--foreground)/0.07)_48%,hsl(var(--background)/0.45)_52%,hsl(var(--foreground)/0.035)_76%,transparent)] lg:block" />
            <div className="pointer-events-none absolute inset-y-8 left-1/2 z-30 hidden w-px -translate-x-1/2 bg-border/60 lg:block" />
            <div className="pointer-events-none absolute top-0 right-0 bottom-0 hidden w-5 bg-[repeating-linear-gradient(to_bottom,hsl(var(--border)),hsl(var(--border))_1px,transparent_1px,transparent_7px)] opacity-50 lg:block" />

            <section className="relative hidden overflow-hidden bg-[linear-gradient(105deg,hsl(var(--card)),hsl(var(--primary-muted)))] p-8 lg:flex lg:origin-[right_center] lg:transform-[rotateY(2deg)] lg:flex-col lg:rounded-l-md">
              <div className="absolute inset-y-0 right-0 w-8 bg-linear-to-l from-foreground/5 to-transparent" />
              <div className="pointer-events-none absolute top-16 -right-24 size-64 rounded-full border border-primary/15" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-success/10" />

              <div className="relative z-10 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_12px_24px_-14px_hsl(var(--primary))]">
                  <GraduationCap className="size-6" />
                </div>
                <div>
                  <p className="text-xl font-extrabold tracking-tight">
                    AMES ENGLISH
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    Cổng học tập hiện đại
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-16 max-w-xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-semibold text-primary">
                  <ShieldCheck className="size-3.5" />
                  Học tập theo nhóm, cùng nhau tiến bộ
                </div>
                <h1 className="text-2xl leading-tight font-black tracking-tight text-foreground">
                  Cùng học tiếng Anh, cùng nhau tiến bộ.
                </h1>
                <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
                  Thi đua học tập, cùng nhau thăng hạng.
                </p>
              </div>

              <div className="relative z-10 mt-10 grid grid-cols-3 gap-3">
                {featuredFeatures.map((item) => (
                  <div
                    key={item.title}
                    className={`rounded-xl border p-4 shadow-sm ${item.className}`}
                  >
                    <div
                      className={`mb-3 h-1.5 w-10 rounded-full ${item.accentClassName}`}
                    />
                    <p className="text-sm leading-5 font-black tracking-tight">
                      {item.title}
                    </p>
                    <p className="mt-2 text-xs leading-5 font-medium text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="relative z-10 mt-6 rounded-2xl border border-border bg-background/80 p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">
                      Tiếng Anh cho học sinh tiểu học
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Học nhẹ nhàng qua hình ảnh, âm thanh và trò chơi
                    </p>
                  </div>
                  <CalendarClock className="size-5 text-primary" />
                </div>

                <div className="space-y-3">
                  {englishLearningItems.map((item) => {
                    const Icon = item.icon

                    return (
                      <div
                        key={item.title}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                      >
                        <div className="grid size-12 place-items-center rounded-lg bg-info-muted text-info">
                          <Icon className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.meta}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            <section className="relative mx-auto w-full max-w-115 bg-card p-5 sm:p-8 lg:max-w-none lg:origin-[left_center] lg:transform-[rotateY(-2deg)] lg:rounded-r-md lg:bg-[linear-gradient(255deg,hsl(var(--card)),hsl(var(--background)))] lg:p-10">
              <div className="absolute inset-y-0 left-0 hidden w-8 bg-linear-to-r from-foreground/5 to-transparent lg:block" />
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <GraduationCap className="size-5" />
                </div>
                <div>
                  <p className="text-lg font-extrabold tracking-tight">
                    AMES ENGLISH
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Cổng học tập hiện đại
                  </p>
                </div>
              </div>

              <div className="relative z-10 mx-auto flex min-h-full w-full max-w-md flex-col justify-center">
                <div className="mb-8">
                  <div className="mb-4 grid size-11 place-items-center rounded-xl bg-success-muted text-success">
                    <LogIn className="size-5" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight">
                    Đăng nhập hệ thống
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Dùng tài khoản học sinh để học tập, làm bài và xem kết quả.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="username">Tên đăng nhập</Label>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Nhập mã tên đăng nhập"
                        className="h-11 pl-9"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        className="h-11 pl-9"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full text-sm font-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="size-4 animate-spin" />
                        Đang đăng nhập...
                      </>
                    ) : (
                      <>
                        Vào cổng học tập
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                  Tài khoản demo:{" "}
                  <span className="font-semibold text-foreground">ames</span> /
                  <span className="font-semibold text-foreground">
                    {" "}
                    iloveames
                  </span>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                  <span>Chưa có tài khoản?</span>
                  <Link
                    href="/register"
                    className="font-bold text-primary hover:underline"
                  >
                    Yêu cầu cấp tài khoản
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
