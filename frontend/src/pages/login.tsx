import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import AuthShell from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await login(username.trim(), password)
      toast.success("Đăng nhập thành công — chào mừng về nhà!")
      navigate("/app")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Đăng nhập"
      description="Về nhà thôi — mọi thứ của gia đình đang chờ bạn."
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link to="/dang-ky" className="font-medium text-lamp-300 hover:underline">
            Đăng ký
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-wine-300/30 bg-wine-400/10 px-4 py-3 text-sm text-wine-300">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="username">Tên đăng nhập</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="vd: ba_mai"
            autoComplete="username"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          Đăng nhập
        </Button>
      </form>
    </AuthShell>
  )
}