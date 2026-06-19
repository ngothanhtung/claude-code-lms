"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import {
  ArrowRight,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  Mail,
  OctagonX,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login.schema"

function getSafeCallbackUrl() {
  const callbackUrl = new URLSearchParams(window.location.search).get(
    "callbackUrl"
  )

  if (!callbackUrl?.startsWith("/") || callbackUrl.startsWith("//")) {
    return "/dashboard"
  }

  return callbackUrl
}

export function LoginStudent() {
  const router = useRouter()
  const form = useForm<LoginFormValues>({
    defaultValues: {
      password: "",
      email: "",
    },
    resolver: zodResolver(loginSchema),
  })
  const [authAlert, setAuthAlert] = useState<{
    description: string
    title: string
  } | null>(null)

  async function handleLogin(values: LoginFormValues) {
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        form.setError("password", {
          message: "Tên đăng nhập hoặc mật khẩu không đúng",
          type: "validate",
        })
        setAuthAlert({
          title: "Đăng nhập không thành công",
          description:
            "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng kiểm tra lại thông tin.",
        })
        form.setValue("password", "")
        return
      }

      router.push(getSafeCallbackUrl())
      router.refresh()
    } catch {
      setAuthAlert({
        title: "Không thể đăng nhập",
        description:
          "Có lỗi xảy ra trong quá trình đăng nhập, vui lòng thử lại.",
      })
      form.setValue("password", "")
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-8 text-foreground">
      <AlertDialog
        open={Boolean(authAlert)}
        onOpenChange={(open) => {
          if (!open) {
            setAuthAlert(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <OctagonX className="size-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>{authAlert?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {authAlert?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction variant="destructive">Đã hiểu</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <section className="w-full max-w-sm rounded-md border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Đăng nhập học sinh
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Vào cổng học tập bằng tài khoản được cấp.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(handleLogin)}
          className="space-y-5"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Nhập email"
                className="h-11 pl-9"
                aria-invalid={Boolean(form.formState.errors.email)}
                disabled={form.formState.isSubmitting}
                autoComplete="email"
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email?.message && (
              <p className="text-xs font-medium text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
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
                aria-invalid={Boolean(form.formState.errors.password)}
                disabled={form.formState.isSubmitting}
                autoComplete="current-password"
                {...form.register("password")}
              />
            </div>
            {form.formState.errors.password?.message && (
              <p className="text-xs font-medium text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="h-11 w-full text-sm font-bold"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              <>
                Đăng nhập
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 rounded-md border border-dashed border-border bg-muted/40 p-3 text-center text-sm text-muted-foreground">
          Demo: <span className="font-semibold text-foreground">admin@school.edu.vn</span> /{" "}
          <span className="font-semibold text-foreground">147258369</span>
        </div>
      </section>
    </main>
  )
}
