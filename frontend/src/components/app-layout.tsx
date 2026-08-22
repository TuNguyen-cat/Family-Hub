import { useState } from "react"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  Bell,
  CalendarDays,
  Home,
  ListChecks,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Settings,
  ShoppingBasket,
  Sparkles,
  Trophy,
  Wallet,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: Home, to: "/app" },
  { id: "lich", label: "Lịch", icon: CalendarDays, to: "/app/lich" },
  { id: "viec-nha", label: "Việc nhà", icon: ListChecks, to: "/app/viec-nha" },
  { id: "chi-tieu", label: "Chi tiêu", icon: Wallet, to: "/app/chi-tieu" },
  { id: "mua-sam", label: "Mua sắm", icon: ShoppingBasket, to: "/app/mua-sam" },
  { id: "phan-thuong", label: "Phần thưởng", icon: Trophy, to: "/app/phan-thuong" },
  { id: "family-ai", label: "Family AI", icon: Sparkles, to: "/app/family-ai" },
  { id: "tin-nhan", label: "Tin nhắn", icon: MessageCircle, to: "/app/tin-nhan" },
  { id: "cai-dat", label: "Cài đặt", icon: Settings, to: "/app/cai-dat" },
]

const ROLE_LABEL: Record<string, string> = {
  parent: "Ba/Mẹ",
  child: "Con",
  other: "Khác",
}

const TITLES: Record<string, string> = {
  "/app": "Dashboard",
  "/app/lich": "Family Calendar",
  "/app/viec-nha": "Family Tasks",
  "/app/chi-tieu": "Family Finance",
  "/app/mua-sam": "Family Shopping",
  "/app/phan-thuong": "Family Rewards",
  "/app/family-ai": "Family AI",
  "/app/tin-nhan": "Family Messages",
  "/app/cai-dat": "Settings",
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const fullName =
    user && (user.first_name || user.last_name)
      ? `${user.first_name} ${user.last_name}`.trim()
      : user?.username

  const initials = user ? user.username.slice(0, 2).toUpperCase() : "FH"
  const title = TITLES[location.pathname] ?? "FamilyHub"

  function handleLogout() {
    logout()
    navigate("/")
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="flex size-10 items-center justify-center rounded-xl bg-lamp-400 font-display text-base font-bold text-night-900">
          {initials}
        </span>
        <div>
          <p className="font-display text-base leading-none text-cream-50">
            Family<span className="italic text-lamp-300">Hub</span>
          </p>
          <p className="mt-1 text-xs text-bark-500">{user?.family_name ?? "Gia đình"}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const isActive = item.to === "/app" ? location.pathname === "/app" : location.pathname === item.to
          return (
            <NavLink
              key={item.id}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-lamp-400/10 text-lamp-300"
                  : "text-bark-400 hover:bg-cream-50/5 hover:text-cream-100",
              )}
            >
              <item.icon className="size-4.5 shrink-0" />
              {item.label}
              {isActive && <span className="ml-auto size-1.5 rounded-full bg-lamp-400" />}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-cream-50/10 p-4">
        <div className="mb-3 flex items-center gap-3 px-3">
          <span className="flex size-9 select-none items-center justify-center rounded-full bg-night-700 text-xs font-semibold text-lamp-300">
            {initials}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-cream-100">{fullName}</p>
            <p className="text-xs text-bark-500">{ROLE_LABEL[user?.role ?? "other"]}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-bark-400" onClick={handleLogout}>
          <LogOut /> Đăng xuất
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-svh lg:flex">
      <aside className="hidden w-64 shrink-0 border-r border-cream-50/10 bg-night-900 lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:block">
        <div className="h-full overflow-y-auto">
          {sidebar}
        </div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Đóng menu"
            className="absolute inset-0 bg-night-950/70 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-cream-50/10 bg-night-900">
            <button
              aria-label="Đóng menu"
              className="absolute top-5 right-5 text-bark-400 hover:text-cream-100"
              onClick={() => setMenuOpen(false)}
            >
              <X className="size-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-cream-50/10 bg-night-900/80 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(true)}>
                <Menu />
              </Button>
              <span className="font-display text-lg text-cream-50">
                Family<span className="italic text-lamp-300">Hub</span>
              </span>
            </div>

            <h1 className="hidden text-lg font-semibold text-cream-50 lg:block">{title}</h1>

            <div className="relative hidden max-w-sm flex-1 md:block">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-bark-500" />
              <input
                type="search"
                placeholder="Tìm kiếm sự kiện, việc nhà…"
                className="w-full rounded-lg border border-cream-50/10 bg-night-800/60 py-2 pr-3 pl-9 text-sm text-cream-100 placeholder:text-bark-500 focus:ring-2 focus:ring-lamp-400/40 focus:outline-none"
              />
            </div>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <Button variant="ghost" size="icon" className="text-bark-400 hover:text-cream-100">
                <Bell />
              </Button>
              <span className="flex size-9 items-center justify-center rounded-full bg-lamp-400 text-xs font-semibold text-night-900">
                {initials}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}