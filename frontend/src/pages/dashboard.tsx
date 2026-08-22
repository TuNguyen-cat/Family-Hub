import { useRef } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  ListChecks,
  ShoppingBasket,
  Sparkles,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { useData, type MemberKey } from "@/context/data-context"

gsap.registerPlugin(useGSAP)

const MEMBER_INITIAL: Record<MemberKey, string> = {
  dad: "D",
  mom: "M",
  minh: "Mi",
  an: "A",
  family: "FH",
}

const MEMBER_CHIP: Record<MemberKey, string> = {
  dad: "bg-blue-500/20 text-blue-300",
  mom: "bg-purple-500/20 text-purple-300",
  minh: "bg-teal-500/20 text-teal-300",
  an: "bg-pink-500/20 text-pink-300",
  family: "bg-lamp-400/20 text-lamp-300",
}

const MEMBERS = [
  { emoji: "👨", name: "Bố", status: "online" },
  { emoji: "👩", name: "Mẹ", status: "online" },
  { emoji: "👦", name: "Minh", status: "online" },
  { emoji: "👧", name: "An", status: "away" },
]

const DAYS = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"]

export default function Dashboard() {
  const { user } = useAuth()
  const { events, tasks, completed, toggleTask, memberKeyForUsername } = useData()
  const rootRef = useRef<HTMLDivElement>(null)

  const today = new Date()
  const dateLabel = `${DAYS[today.getDay()]}, ${today.getDate()} tháng ${today.getMonth() + 1}`

  const currentMember = memberKeyForUsername(user?.username)
  const todayEvents = events.filter((e) => e.day === today.getDate())
  const myTasks = tasks.filter((t) => t.member === currentMember)

  const stats = [
    { icon: CalendarDays, value: String(events.length), label: "Sự kiện" },
    { icon: ListChecks, value: String(tasks.length), label: "Nhiệm vụ" },
    { icon: ShoppingBasket, value: "5", label: "Cần mua" },
    { icon: Wallet, value: "75%", label: "Ngân sách" },
  ]

  useGSAP(
    () => {
      gsap.fromTo(
        ".dash-fade",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" },
      )
    },
    { scope: rootRef },
  )

  function toggleTaskDone(id: number) {
    toggleTask(id)
  }

  return (
    <div ref={rootRef} className="mx-auto max-w-6xl space-y-6">
      <div className="dash-fade mb-8">
        <h1 className="font-display text-3xl text-cream-50">
          Chào {user?.username} <span className="align-middle">👋</span>
        </h1>
        <p className="mt-1 text-sm text-bark-400">{dateLabel}</p>
      </div>

      <div className="dash-fade grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-cream-50/10 bg-night-800/50 p-4 backdrop-blur-sm sm:p-5"
          >
            <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-night-700">
              <stat.icon className="size-4.5 text-lamp-300" />
            </div>
            <p className="font-display text-2xl text-cream-50">{stat.value}</p>
            <p className="mt-0.5 text-xs text-bark-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="dash-fade grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-cream-50/10 bg-night-800/50 p-5 backdrop-blur-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-widest text-cream-50 uppercase">
              <CalendarDays className="size-4 text-lamp-300" /> Lịch hôm nay
            </h2>
            <Link
              to="/app/lich"
              className="flex items-center gap-1 text-xs font-medium text-leaf-300 hover:underline"
            >
              Xem lịch <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {todayEvents.length === 0 ? (
            <p className="py-4 text-center text-sm text-bark-500">Không có sự kiện hôm nay</p>
          ) : (
            <ul className="space-y-3">
              {todayEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-cream-50/5"
                >
                  <span className="w-11 font-mono text-sm text-bark-400">{event.time}</span>
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                      MEMBER_CHIP[event.member],
                    )}
                  >
                    {MEMBER_INITIAL[event.member]}
                  </span>
                  <span className="text-sm text-cream-100">{event.title}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-cream-50/10 bg-night-800/50 p-5 backdrop-blur-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-widest text-cream-50 uppercase">
              <ListChecks className="size-4 text-lamp-300" /> Việc của bạn
            </h2>
            <Link
              to="/app/viec-nha"
              className="flex items-center gap-1 text-xs text-leaf-300 hover:underline"
            >
              Xem tất cả <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {myTasks.length === 0 ? (
            <p className="py-4 text-center text-sm text-bark-500">Bạn chưa có việc nào</p>
          ) : (
            <ul className="space-y-3">
              {myTasks.map((task) => {
                const done = task.status === "done" || completed.has(task.id)
                return (
                  <li key={task.id}>
                    <button
                      onClick={() => toggleTaskDone(task.id)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-cream-50/5"
                    >
                      {done ? (
                        <CheckCircle2 className="size-5 shrink-0 text-leaf-400" />
                      ) : (
                        <Circle className="size-5 shrink-0 text-bark-500" />
                      )}
                      <span
                        className={cn(
                          "text-sm",
                          done ? "text-bark-500 line-through" : "text-cream-100",
                        )}
                      >
                        {task.title}
                      </span>
                      <span className="ml-auto rounded-full bg-lamp-400/10 px-2 py-0.5 text-xs font-medium text-lamp-300">
                        +{task.xp} XP
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-cream-50/10 bg-night-800/50 p-5 backdrop-blur-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-widest text-cream-50 uppercase">
              <Wallet className="size-4 text-lamp-300" /> Chi tiêu tháng này
            </h2>
            <button className="flex items-center gap-1 text-xs text-leaf-300 hover:underline">
              Xem chi tiêu <ArrowRight className="size-3.5" />
            </button>
          </div>
          <p className="text-sm text-bark-400">
            Đã dùng <span className="font-medium text-cream-100">17,5M</span> /{" "}
            <span className="text-cream-300">23M</span>
          </p>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-night-700">
            <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-leaf-500 to-leaf-300" />
          </div>
          <p className="mt-2 text-xs text-bark-500">76% ngân sách · còn 5,5M</p>
        </section>

        <section className="rounded-xl border border-cream-50/10 bg-night-800/50 p-5 backdrop-blur-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-widest text-cream-50 uppercase">
              Thành viên
            </h2>
            <span className="text-base" aria-hidden>
              👨‍👩‍👧‍👦
            </span>
          </div>
          <ul className="space-y-2">
            {MEMBERS.map((member) => (
              <li
                key={member.name}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-cream-50/5"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-night-700 text-base">
                  {member.emoji}
                </span>
                <span className="text-sm text-cream-100">{member.name}</span>
                <span
                  className={cn(
                    "ml-auto flex items-center gap-1.5 text-xs",
                    member.status === "online" ? "text-leaf-300" : "text-lamp-300",
                  )}
                >
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      member.status === "online" ? "bg-leaf-400" : "bg-lamp-400",
                    )}
                  />
                  {member.status === "online" ? "Đang hoạt động" : "Nghỉ"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="relative overflow-hidden rounded-xl border border-lamp-400/20 bg-night-800/70 p-5 backdrop-blur-sm sm:p-6 lg:col-span-2">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(244,189,92,0.5), transparent)",
            }}
          />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 size-5 shrink-0 text-lamp-300" />
              <div>
                <h2 className="text-sm font-semibold tracking-widest text-cream-50 uppercase">
                  Family AI
                </h2>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-bark-400">
                  “Tuần này có 2 lịch bị trùng. Bạn muốn tôi đề xuất cách sắp xếp lại
                  không?”
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="shrink-0">
              Xem <ArrowRight />
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}