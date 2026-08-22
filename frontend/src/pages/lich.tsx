import { useMemo, useState } from "react"
import {
  Briefcase,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Clock,
  PartyPopper,
  ShoppingBag,
  Sparkles,
  Users,
  UtensilsCrossed,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useData, type CalEvent, type MemberKey } from "@/context/data-context"

const MEMBERS: { key: MemberKey; label: string; initial: string }[] = [
  { key: "dad", label: "Bố", initial: "B" },
  { key: "mom", label: "Mẹ", initial: "M" },
  { key: "minh", label: "Minh", initial: "Mi" },
  { key: "an", label: "An", initial: "A" },
  { key: "family", label: "Gia đình", initial: "FH" },
]

const MEMBER_STYLE: Record<
  MemberKey,
  { chip: string; dot: string; border: string; text: string; avatar: string }
> = {
  dad: {
    chip: "bg-blue-500/15 text-blue-300 border-blue-400/20",
    dot: "bg-blue-400",
    border: "border-l-blue-400",
    text: "text-blue-300",
    avatar: "bg-blue-500/20 text-blue-300",
  },
  mom: {
    chip: "bg-purple-500/15 text-purple-300 border-purple-400/20",
    dot: "bg-purple-400",
    border: "border-l-purple-400",
    text: "text-purple-300",
    avatar: "bg-purple-500/20 text-purple-300",
  },
  minh: {
    chip: "bg-teal-500/15 text-teal-300 border-teal-400/20",
    dot: "bg-teal-400",
    border: "border-l-teal-400",
    text: "text-teal-300",
    avatar: "bg-teal-500/20 text-teal-300",
  },
  an: {
    chip: "bg-pink-500/15 text-pink-300 border-pink-400/20",
    dot: "bg-pink-400",
    border: "border-l-pink-400",
    text: "text-pink-300",
    avatar: "bg-pink-500/20 text-pink-300",
  },
  family: {
    chip: "bg-lamp-400/15 text-lamp-300 border-lamp-400/25",
    dot: "bg-lamp-400",
    border: "border-l-lamp-400",
    text: "text-lamp-300",
    avatar: "bg-lamp-400/20 text-lamp-300",
  },
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
const VIEWS = ["Tháng", "Tuần", "Ngày"] as const
type View = (typeof VIEWS)[number]

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leading = (first.getDay() + 6) % 7
  const cells: { day: number | null; isToday: boolean }[] = []
  for (let i = 0; i < leading; i++) cells.push({ day: null, isToday: false })
  const today = new Date()
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      isToday:
        d === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
    })
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, isToday: false })
  return cells
}

const UPCOMING = [
  { date: "CN, 16 Thg 8", time: "7:00 PM", title: "Ăn tối gia đình", member: "family" as MemberKey, icon: UtensilsCrossed, participants: 4 },
  { date: "T7, 22 Thg 8", time: "6:30 PM", title: "Tiệc sinh nhật", member: "family" as MemberKey, icon: PartyPopper, participants: 5 },
  { date: "T2, 24 Thg 8", time: "10:00 AM", title: "Họp làm việc", member: "dad" as MemberKey, icon: Briefcase, participants: 1 },
  { date: "T5, 27 Thg 8", time: "9:30 AM", title: "Mua sắm", member: "mom" as MemberKey, icon: ShoppingBag, participants: 2 },
]

const MONTH_YEAR = "Tháng 8 2026"

export default function Lich() {
  const { events } = useData()
  const grid = useMemo(() => buildMonthGrid(2026, 7), [])
  const [selected, setSelected] = useState<Set<MemberKey>>(
    () => new Set(MEMBERS.map((m) => m.key)),
  )
  const [view, setView] = useState<View>("Tháng")

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalEvent[]>()
    for (const e of events) {
      if (!selected.has(e.member)) continue
      const list = map.get(e.day) ?? []
      list.push(e)
      map.set(e.day, list)
    }
    return map
  }, [events, selected])

  const toggleMember = (key: MemberKey) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-bark-400">
          Garden View · <span className="text-cream-100">Nha Trang</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-bark-300">
            <Users className="size-4" /> Chia sẻ
          </Button>
          <Button size="sm">
            <CalendarPlus /> Tạo sự kiện
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="rounded-2xl border border-cream-50/10 bg-night-800/50 p-5 backdrop-blur-sm sm:p-6">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Button variant="secondary" size="sm">
                Hôm nay
              </Button>
              <div className="flex overflow-hidden rounded-lg border border-cream-50/10">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none text-bark-400">
                  <ChevronLeft />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none text-bark-400">
                  <ChevronRight />
                </Button>
              </div>
              <h2 className="ml-1 text-base font-semibold text-cream-50">{MONTH_YEAR}</h2>
            </div>

            <div className="ml-auto flex items-center gap-1 rounded-lg border border-cream-50/10 bg-night-900/60 p-1">
              {VIEWS.map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    view === v
                      ? "bg-lamp-400 text-night-900"
                      : "text-bark-400 hover:text-cream-100",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium tracking-wide text-bark-500 uppercase">
              Bộ lọc
            </span>
            {MEMBERS.map((m) => {
              const active = selected.has(m.key)
              return (
                <button
                  key={m.key}
                  onClick={() => toggleMember(m.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-xs font-medium transition-colors",
                    active
                      ? cn("border-transparent", MEMBER_STYLE[m.key].chip)
                      : "border-cream-50/10 text-bark-500 hover:text-cream-100",
                    active && "opacity-100",
                    !active && "opacity-50",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full text-[11px] font-semibold",
                      MEMBER_STYLE[m.key].avatar,
                    )}
                  >
                    {m.initial}
                  </span>
                  {m.label}
                  <span className={cn("size-1.5 rounded-full", MEMBER_STYLE[m.key].dot)} />
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-7">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="border-b border-cream-50/10 py-2 text-center text-xs font-medium tracking-wider text-bark-500 uppercase"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {grid.map((cell, i) => (
              <div
                key={i}
                className={cn(
                  "min-h-24 border-b border-cream-50/5 sm:min-h-28",
                  i % 7 !== 6 && "border-r border-cream-50/5",
                )}
              >
                <div className="flex items-center justify-between px-2 pt-2">
                  {cell.day !== null && (
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-xs",
                        cell.isToday
                          ? "bg-lamp-400 font-semibold text-night-900"
                          : "text-bark-400",
                      )}
                    >
                      {cell.day}
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-1 px-1.5 pb-2">
                  {(eventsByDay.get(cell.day ?? -1) ?? []).slice(0, 3).map((e) => {
                    const style = MEMBER_STYLE[e.member]
                    return (
                      <button
                        key={e.id}
                        className={cn(
                          "flex w-full items-center gap-1.5 rounded-md border-l-2 px-2 py-1 text-left transition-colors hover:brightness-125",
                          style.border,
                          style.chip,
                        )}
                      >
                        <Clock className="size-3 shrink-0 opacity-70" />
                        <span className="truncate text-[11px] font-medium">
                          {e.time} · {e.title}
                        </span>
                      </button>
                    )
                  })}
                  {(eventsByDay.get(cell.day ?? -1) ?? []).length > 3 && (
                    <p className="px-2 text-[10px] text-bark-500">
                      +{eventsByDay.get(cell.day ?? -1)!.length - 3} sự kiện khác
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-cream-50/10 bg-night-800/50 p-5 backdrop-blur-sm">
            <h3 className="mb-4 text-sm font-semibold text-cream-50">Sự kiện sắp tới</h3>
            <ul className="space-y-4">
              {UPCOMING.map((e) => {
                const style = MEMBER_STYLE[e.member]
                return (
                  <li key={`${e.title}-${e.date}`} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl",
                        style.avatar,
                      )}
                    >
                      {e.icon && <e.icon className="size-4.5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-cream-100">{e.title}</p>
                      <p className="text-xs text-bark-400">
                        {e.date} · {e.time}
                      </p>
                    </div>
                    <div className="flex -space-x-1.5">
                      {Array.from({ length: Math.min(e.participants, 3) }).map((_, idx) => (
                        <span
                          key={idx}
                          className="flex size-5 shrink-0 items-center justify-center rounded-full border border-night-900 text-[8px] font-semibold text-night-900"
                          style={{ backgroundColor: ["#60a5fa", "#c084fc", "#5eead4", "#7da689"][idx] }}
                        >
                          {["B", "M", "Mi", "A"][idx]}
                        </span>
                      ))}
                      {e.participants > 3 && (
                        <span className="flex size-5 items-center justify-center rounded-full border border-night-900 bg-night-700 text-[8px] text-bark-400">
                          +{e.participants - 3}
                        </span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>

<section className="rounded-2xl border border-blue-400/20 bg-gradient-to-b from-blue-500/10 to-purple-500/10 p-5 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                <Sparkles className="size-4" />
              </span>
              <h3 className="text-sm font-semibold text-cream-50">Tìm thời gian rảnh gia đình</h3>
            </div>
            <div className="rounded-xl border border-cream-50/10 bg-night-900/50 p-4">
              <p className="text-sm font-medium text-cream-100">Chủ nhật, 7:00 PM – 9:00 PM</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex -space-x-1.5">
                  {["B", "M", "Mi", "A"].map((ini, idx) => (
                    <span
                      key={ini}
                      className="flex size-6 items-center justify-center rounded-full border border-night-900 text-[9px] font-semibold text-night-900"
                      style={{ backgroundColor: ["#60a5fa", "#c084fc", "#5eead4", "#f472b6"][idx] }}
                    >
                      {ini}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-leaf-300">4/4 thành viên gia đình có mặt</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              Tìm thêm khung giờ
            </Button>
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
                  Tôi tìm thấy 2 xung đột lịch tuần này. Bạn có muốn tôi đề xuất khung giờ tốt hơn không?
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="mt-4">
              Xem gợi ý
            </Button>
          </section>
        </aside>
      </div>
    </div>
  )
}