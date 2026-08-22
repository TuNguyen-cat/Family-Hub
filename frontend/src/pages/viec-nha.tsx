import { useState } from "react"
import {
  AlertTriangle,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  CircleDot,
  ClipboardList,
  Clock,
  Droplets,
  Flame,
  ListFilter,
  Loader2,
  Plus,
  Shirt,
  ShoppingBasket,
  Sparkles,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  useData,
  type BoardTask,
  type Category,
  type MemberKey,
  type Priority,
  type Status,
} from "@/context/data-context"

const MEMBERS: { key: MemberKey; label: string; initial: string }[] = [
  { key: "dad", label: "Bố", initial: "B" },
  { key: "mom", label: "Mẹ", initial: "M" },
  { key: "minh", label: "Minh", initial: "Mi" },
  { key: "an", label: "An", initial: "A" },
]

const MEMBER_STYLE: Record<MemberKey, { chip: string; avatar: string; bar: string }> = {
  dad: { chip: "bg-blue-500/15 text-blue-300", avatar: "bg-blue-500/20 text-blue-300", bar: "bg-blue-400" },
  mom: { chip: "bg-purple-500/15 text-purple-300", avatar: "bg-purple-500/20 text-purple-300", bar: "bg-purple-400" },
  minh: { chip: "bg-teal-500/15 text-teal-300", avatar: "bg-teal-500/20 text-teal-300", bar: "bg-teal-400" },
  an: { chip: "bg-pink-500/15 text-pink-300", avatar: "bg-pink-500/20 text-pink-300", bar: "bg-pink-400" },
  family: { chip: "bg-lamp-400/15 text-lamp-300", avatar: "bg-lamp-400/20 text-lamp-300", bar: "bg-lamp-400" },
}

const CATEGORIES: { key: Category; label: string; icon: LucideIcon }[] = [
  { key: "chores", label: "Việc nhà", icon: ClipboardList },
  { key: "shopping", label: "Mua sắm", icon: ShoppingBasket },
  { key: "cleaning", label: "Dọn dẹp", icon: Droplets },
  { key: "laundry", label: "Giặt ủi", icon: Shirt },
  { key: "meal", label: "Nấu ăn", icon: Flame },
  { key: "errand", label: "Việc ngoài", icon: CalendarDays },
]

const COLUMNS: { key: Status; label: string; icon: LucideIcon }[] = [
  { key: "todo", label: "Cần làm", icon: CircleDot },
  { key: "progress", label: "Đang làm", icon: Loader2 },
  { key: "review", label: "Chờ duyệt", icon: CalendarDays },
  { key: "done", label: "Hoàn thành", icon: CheckCheck },
]

const PRIORITY_STYLE: Record<Priority, { chip: string; dot: string }> = {
  low: { chip: "bg-leaf-400/10 text-leaf-300", dot: "bg-leaf-400" },
  medium: { chip: "bg-lamp-400/10 text-lamp-300", dot: "bg-lamp-400" },
  high: { chip: "bg-wine-400/10 text-wine-300", dot: "bg-wine-400" },
}

const TABS = ["Tất cả", "Việc của tôi", "Hôm nay", "Sắp tới", "Đã xong"] as const
type Tab = (typeof TABS)[number]

const SORTS = ["Hạn chót", "Ưu tiên", "Mới nhất"] as const

export default function ViecNha() {
  const { tasks: allTasks, completed, toggleTask } = useData()
  const [tab, setTab] = useState<Tab>("Tất cả")
  const [memberFilter, setMemberFilter] = useState<MemberKey | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all")
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Hạn chót")
  const [quickAssign, setQuickAssign] = useState<MemberKey>("mom")
  const [showModal, setShowModal] = useState(false)

  const tasks = allTasks.filter((t) => {
    if (tab === "Việc của tôi" && t.member !== "minh") return false
    if (tab === "Đã xong" && t.status !== "done" && !completed.has(t.id)) return false
    if (memberFilter !== "all" && t.member !== memberFilter) return false
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false
    return true
  })

  const filtered = [...tasks].sort((a, b) => {
    if (sort === "Ưu tiên") {
      const order = { high: 0, medium: 1, low: 2 }
      return order[a.priority] - order[b.priority]
    }
    return a.id - b.id
  })

  const stats = [
    { label: "Tổng việc", value: "12", icon: ClipboardList, tint: "text-blue-300 bg-blue-500/15" },
    { label: "Việc của tôi", value: "4", icon: Users, tint: "text-purple-300 bg-purple-500/15" },
    { label: "Đã xong", value: "8", icon: CheckCheck, tint: "text-teal-300 bg-teal-500/15" },
    { label: "Quá hạn", value: "2", icon: AlertTriangle, tint: "text-wine-300 bg-wine-400/15" },
  ]

  const workload = [
    { label: "Bố", tasks: 3, key: "dad" as MemberKey },
    { label: "Mẹ", tasks: 4, key: "mom" as MemberKey },
    { label: "Minh", tasks: 2, key: "minh" as MemberKey },
    { label: "An", tasks: 3, key: "an" as MemberKey },
  ]

  const toggleDone = (id: number) => {
    toggleTask(id)
  }

  const renderCard = (t: BoardTask, status: Status) => {
    const member = MEMBERS.find((m) => m.key === t.member)!
    const mStyle = MEMBER_STYLE[t.member]
    const pStyle = PRIORITY_STYLE[t.priority]
    const cat = CATEGORIES.find((c) => c.key === t.category) ?? CATEGORIES[0]
    const isDone = status === "done" || completed.has(t.id)
    return (
      <button
        key={t.id}
        onClick={() => (status === "todo" ? toggleDone(t.id) : undefined)}
        className={cn(
          "group w-full rounded-xl border border-cream-50/10 bg-night-900/40 p-3.5 text-left transition-colors hover:border-cream-50/20",
          isDone && "opacity-70",
        )}
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          {status === "todo" ? (
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                isDone ? "border-leaf-400 bg-leaf-400 text-night-900" : "border-cream-50/30 text-transparent group-hover:border-lamp-400",
              )}
            >
              <Check className="size-3" />
            </span>
          ) : status === "progress" ? (
            <span className="flex size-5 items-center justify-center rounded-full border border-lamp-400 text-lamp-300">
              <span className="size-2 rounded-full bg-lamp-400" />
            </span>
          ) : status === "review" ? (
            <CircleDot className="size-5 text-bark-400" />
          ) : (
            <span className="flex size-5 items-center justify-center rounded-md bg-leaf-400 text-night-900">
              <Check className="size-3" />
            </span>
          )}
          <span
            className={cn(
              "ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
              pStyle.chip,
            )}
          >
            {t.priority}
          </span>
        </div>

        <p className={cn("mb-3 text-sm font-medium text-cream-100", isDone && "text-bark-500 line-through")}>
          {t.title}
        </p>

        <div className="mb-3 flex items-center gap-2">
          <span
            className={cn(
              "flex size-6 items-center justify-center rounded-full text-[10px] font-semibold",
              mStyle.avatar,
            )}
          >
            {member.initial}
          </span>
          <span className="flex items-center gap-1 text-xs text-bark-400">
            <Clock className="size-3" /> {t.due}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-cream-50/5 pt-2.5">
          <span className="flex items-center gap-1.5 text-xs text-bark-400">
            <cat.icon className="size-3.5" /> {cat.label}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-lamp-300">
            <Sparkles className="size-3" /> +{t.xp} XP
          </span>
        </div>
      </button>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-cream-50">Việc nhà</h1>
          <p className="mt-1 text-sm text-bark-400">Tổ chức và chia sẻ trách nhiệm gia đình</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)} className="bg-lamp-400 hover:bg-lamp-300 text-night-900">
          <Plus className="mr-2" /> Tạo nhiệm vụ
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-cream-50/10 bg-night-800/50 p-4 backdrop-blur-sm">
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", s.tint)}>
              <s.icon className="size-5" />
            </span>
            <div>
              <p className="text-lg font-semibold text-cream-50">{s.value}</p>
              <p className="text-xs text-bark-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-cream-50/10 bg-night-800/50 p-3 backdrop-blur-sm">
        <div className="flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                tab === t ? "bg-lamp-400 text-night-900" : "text-bark-400 hover:text-cream-100",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
<div className="flex items-center gap-1.5 rounded-lg border border-cream-50/10 px-2.5 py-1.5">
              <Users className="size-3.5 text-bark-500" />
              <select
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value as MemberKey | "all")}
                className="bg-transparent text-xs text-cream-100 focus:outline-none"
              >
                <option value="all">Tất cả thành viên</option>
                {MEMBERS.map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </select>
              <ChevronDown className="size-3.5 text-bark-500" />
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-cream-50/10 px-2.5 py-1.5">
              <ListFilter className="size-3.5 text-bark-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as Category | "all")}
                className="bg-transparent text-xs text-cream-100 focus:outline-none"
              >
                <option value="all">Tất cả danh mục</option>
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
              <ChevronDown className="size-3.5 text-bark-500" />
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-cream-50/10 px-2.5 py-1.5">
              <Clock className="size-3.5 text-bark-500" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
                className="bg-transparent text-xs text-cream-100 focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="size-3.5 text-bark-500" />
            </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <div className="grid gap-4 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <section
              key={col.key}
              className="rounded-2xl border border-cream-50/10 bg-night-800/40 p-3 backdrop-blur-sm"
            >
              <div className="mb-3 flex items-center gap-2 px-1">
                <col.icon className={cn("size-4", col.key === "done" ? "text-leaf-300" : "text-bark-400")} />
                <h3 className="text-sm font-medium text-cream-100">{col.label}</h3>
                <span className="ml-auto rounded-full bg-night-700 px-2 py-0.5 text-xs text-bark-400">
                  {filtered.filter((t) => t.status === col.key).length}
                </span>
              </div>
              <div className="space-y-3">
                {filtered
                  .filter((t) => t.status === col.key)
                  .map((t) => renderCard(t, col.key))}
              </div>
            </section>
          ))}
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-cream-50/10 bg-night-800/50 p-5 backdrop-blur-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-cream-50">
              <Users className="size-4 text-purple-300" /> Phân chia việc
            </h3>
            <ul className="space-y-4">
              {workload.map((w) => {
                const mStyle = MEMBER_STYLE[w.key]
                const pct = (w.tasks / 4) * 100
                return (
                  <li key={w.key}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-cream-100">
                        <span className={cn("flex size-6 items-center justify-center rounded-full text-[10px] font-semibold", mStyle.avatar)}>
                          {w.label.slice(0, 1)}
                        </span>
                        {w.label}
                      </span>
                      <span className="text-xs text-bark-400">{w.tasks} việc</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-night-700">
                      <div className={cn("h-full rounded-full", mStyle.bar)} style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                )
              })}
            </ul>
            <p className="mt-4 rounded-lg bg-purple-500/10 p-3 text-xs leading-relaxed text-purple-300">
              ✨ Mẹ hiện có số việc nhiều nhất.
            </p>
          </section>

          <section className="rounded-2xl border border-cream-50/10 bg-night-800/50 p-5 backdrop-blur-sm">
            <h3 className="mb-1 text-sm font-semibold text-cream-50">Gán nhanh</h3>
            <p className="mb-4 text-xs text-bark-400">Ai nên làm việc này?</p>
            <div className="space-y-2">
              {MEMBERS.map((m) => {
                const active = quickAssign === m.key
                const mStyle = MEMBER_STYLE[m.key]
                return (
                  <button
                    key={m.key}
                    onClick={() => setQuickAssign(m.key)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors",
                      active ? "border-lamp-400/50 bg-lamp-400/5" : "border-cream-50/10 hover:border-cream-50/25",
                    )}
                  >
                    <span className={cn("flex size-8 items-center justify-center rounded-full text-xs font-semibold", mStyle.avatar)}>
                      {m.initial}
                    </span>
                    <span className="text-sm text-cream-100">{m.label}</span>
                    {active && (
                      <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-lamp-400 text-night-900">
                        <Check className="size-3" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="relative overflow-hidden rounded-2xl border border-purple-400/20 bg-night-800/60 p-5 backdrop-blur-sm">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)",
              }}
            />
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
                <Sparkles className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-medium text-cream-50">Gợi ý thông minh</h3>
                <p className="mt-1 text-sm leading-relaxed text-bark-400">
                  Mẹ có 4 việc trong khi Minh có 2. Bạn có muốn tôi đề xuất phân chia cân bằng hơn không?
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="mt-4">
              Xem gợi ý
            </Button>
          </section>
        </aside>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            aria-label="Đóng"
            className="absolute inset-0 bg-night-950/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-cream-50/15 bg-night-800 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-cream-50">Tạo nhiệm vụ</h3>
              <button
                aria-label="Đóng"
                onClick={() => setShowModal(false)}
                className="text-bark-400 hover:text-cream-100"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-bark-400">Tiêu đề việc</label>
                <input className="w-full rounded-lg border border-cream-50/15 bg-night-900/60 px-3 py-2 text-sm text-cream-100 placeholder:text-bark-500 focus:ring-2 focus:ring-lamp-400/40 focus:outline-none" placeholder="Ví dụ: Đổ rác" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-bark-400">Mô tả</label>
                <textarea className="w-full rounded-lg border border-cream-50/15 bg-night-900/60 px-3 py-2 text-sm text-cream-100 placeholder:text-bark-500 focus:ring-2 focus:ring-lamp-400/40 focus:outline-none" rows={2} placeholder="Thêm mô tả ngắn…" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-bark-400">Gán cho</label>
                  <select className="w-full rounded-lg border border-cream-50/15 bg-night-900/60 px-3 py-2 text-sm text-cream-100 focus:ring-2 focus:ring-lamp-400/40 focus:outline-none">
                    {MEMBERS.map((m) => (
                      <option key={m.key} value={m.key}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-bark-400">Danh mục</label>
                  <select className="w-full rounded-lg border border-cream-50/15 bg-night-900/60 px-3 py-2 text-sm text-cream-100 focus:ring-2 focus:ring-lamp-400/40 focus:outline-none">
                    {CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-bark-400">Ngày hết hạn</label>
                  <input type="date" className="w-full rounded-lg border border-cream-50/15 bg-night-900/60 px-3 py-2 text-sm text-cream-100 focus:ring-2 focus:ring-lamp-400/40 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-bark-400">Giờ hết hạn</label>
                  <input type="time" className="w-full rounded-lg border border-cream-50/15 bg-night-900/60 px-3 py-2 text-sm text-cream-100 focus:ring-2 focus:ring-lamp-400/40 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-bark-400">Ưu tiên</label>
                  <select className="w-full rounded-lg border border-cream-50/15 bg-night-900/60 px-3 py-2 text-sm text-cream-100 focus:ring-2 focus:ring-lamp-400/40 focus:outline-none">
                    <option>Thấp</option>
                    <option>Trung bình</option>
                    <option>Cao</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-bark-400">Lặp lại</label>
                  <select className="w-full rounded-lg border border-cream-50/15 bg-night-900/60 px-3 py-2 text-sm text-cream-100 focus:ring-2 focus:ring-lamp-400/40 focus:outline-none">
                    <option>Không bao giờ</option>
                    <option>Hàng ngày</option>
                    <option>Hàng tuần</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-bark-400">XP thưởng</label>
                  <select className="w-full rounded-lg border border-cream-50/15 bg-night-900/60 px-3 py-2 text-sm text-cream-100 focus:ring-2 focus:ring-lamp-400/40 focus:outline-none">
                    <option>+5 XP</option>
                    <option>+10 XP</option>
                    <option>+15 XP</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-cream-50/10 bg-night-900/40 px-3 py-2.5">
                <span className="text-sm text-cream-100">Nhắc nhở</span>
                <input type="checkbox" className="size-4 accent-lamp-400" defaultChecked />
              </div>
              <Button className="w-full" onClick={() => setShowModal(false)}>
                Tạo nhiệm vụ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}