import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(40rem 30rem at 50% -10%, rgba(234,168,58,0.1), transparent 60%), radial-gradient(30rem 24rem at 90% 110%, rgba(125,166,137,0.1), transparent 60%)",
        }}
      />
      <Link
        to="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-sm text-bark-400 transition-colors hover:text-cream-100"
      >
        <ArrowLeft className="size-4" /> Về trang chủ
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="font-display text-2xl text-cream-50">
            Family<span className="italic text-lamp-300">Hub</span>
          </p>
        </div>
        <Card className="shadow-2xl shadow-black/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-balance">{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
        {footer && <p className="mt-6 text-center text-sm text-bark-400">{footer}</p>}
      </div>
    </main>
  )
}