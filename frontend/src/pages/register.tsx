import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import AuthShell from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"

const ROLES = [
  { value: "parent", label: "Ba/Mẹ" },
  { value: "child", label: "Con" },
  { value: "other", label: "Khác" },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    role: "parent",
    family_name: "",
  })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.")
      return
    }
    if (form.password !== form.confirm) {
      setError("Xác nhận mật khẩu không khớp.")
      return
    }
    setSubmitting(true)
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        family_name: form.family_name.trim(),
      })
      toast.success("Tài khoản đã được tạo — gia đình đã trực tuyến!")
      navigate("/app")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Tạo tài khoản"
      description="Gia đình bạn sẽ được tổ chức ngăn nắp ngay từ bước này."
      footer={
        <>
          Đã có tài khoản?{" "}
          <Link to="/dang-nhap" className="font-medium text-lamp-300 hover:underline">
            Đăng nhập
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-wine-300/30 bg-wine-300/10 px-4 py-3 text-sm text-wine-300">
            {error}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              value={form.username}
              onChange={(e) => set("username", e.target.value)}
              placeholder="vd: ba_mai"
              autoComplete="username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="family_name">Tên gia đình (không bắt buộc)</Label>
          <Input
            id="family_name"
            value={form.family_name}
            onChange={(e) => set("family_name", e.target.value)}
            placeholder="vd: Nhà Mai"
          />
        </div>

        <div className="space-y-2">
          <Label>Vai trò trong gia đình</Label>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => set("role", r.value)}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-sm transition-colors",
                  form.role === r.value
                    ? "border-lamp-400 bg-lamp-400/15 text-cream-50"
                    : "border-cream-50/10 bg-night-900/60 text-bark-400 hover:border-cream-50/25",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="Ít nhất 6 ký tự"
              autoComplete="new-password"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Xác nhận mật khẩu</Label>
            <Input
              id="confirm"
              type="password"
              value={form.confirm}
              onChange={(e) => set("confirm", e.target.value)}
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          Tạo tài khoản
        </Button>
      </form>
    </AuthShell>
  )
}