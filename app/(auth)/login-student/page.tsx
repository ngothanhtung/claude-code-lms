import type { Metadata } from "next"
import { LoginStudent } from "@/features/auth/components/login-student"

export const metadata: Metadata = {
  title: "Đăng nhập học sinh",
}

export default function LoginStudentPage() {
  return <LoginStudent />
}
