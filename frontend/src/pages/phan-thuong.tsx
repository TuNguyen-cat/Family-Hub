import { useRef, useState } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { toast } from "sonner"
import {
  Check,
  Gift,
  History,
  Info,
  Lightbulb,
  Lock,
  Plus,
  Sparkles,
  Target,
  Trophy,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MemberKey } from "@/context/data-context"

gsap.registerPlugin(useGSAP)

type Reward = {
  id: number
  emoji: string
  name: string
  desc: string
  cost: number
  redeemed: boolean
}

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

type BadgeState = "unlocked" | "locked"

const BADGES: {
  emoji: string
  name: string
  desc: string
  progress: number
  target: number
  state: BadgeState
}[] = [
  { emoji: "🧹", name: "Người giúp việc", desc: "Hoàn thành 10 việc nhà", progress: 8, target: 10, state: "locked" },
  { emoji: "⭐", name: "Người chơi đồng đội", desc: "Tham gia 5 hoạt động gia đình", progress: 5, target: 5, state: "unlocked" },
  { emoji: "🔥", name: "Người đóng góp đều đặn", desc: "Hoàn thành việc 7 ngày liên tiếp", progress: 5, target: 7, state: "locked" },
  { emoji: "🤝", name: "Người giúp gia đình", desc: "Giúp đỡ 20 trách nhiệm chung", progress: 12, target: 20, state: "locked" },
]

const ACTIVITY: { member: MemberKey; task: string; xp: number; time: string }[] = [
  { member: "minh", task: "Đổ rác", xp: 5, time: "10 phút trước" },
  { member: "mom", task: "Chuẩn bị bữa tối", xp: 15, time: "1 giờ trước" },
  { member: "dad", task: "Mua sắm thực phẩm", xp: 10, time: "3 giờ trước" },
  { member: "an", task: "Dọn phòng khách", xp: 10, time: "Hôm qua, 7:30 PM" },
]

const INITIAL_REWARDS: Reward[] = [
  { id: 1, emoji: "🎬", name: "Chọn phim gia đình", desc: "Chọn bộ phim và đồ ăn cho đêm xem phim gia đình.", cost: 100, redeemed: false },
  { id: 2, emoji: "🍕", name: "Chọn bữa tối cuối tuần", desc: "Quyết định thực đơn cho bữa tối thứ 7 của gia đình.", cost: 150, redeemed: false },
  { id: 3, emoji: "🎮", name: "Chọn trò chơi gia đình", desc: "Chọn trò chơi cho đêm chơi game gia đình tiếp theo.", cost: 200, redeemed: false },
  { id: 4, emoji: "🌳", name: "Chọn hoạt động cuối tuần", desc: "Lên kế hoạch một buổi dã ngoại gia đình đầy đủ cho cuối tuần tới.", cost: 300, redeemed: false },
]

function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section
      className={cn(
        "rounded-xl border border-cream-50/10 bg-night-800/50 p-5 backdrop-blur-sm sm:p-6",
        className,
      )}
    >
      {children}
    </section>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon?: LucideIcon
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-widest text-cream-50 uppercase">
          {Icon && <Icon className="size-4 shrink-0 text-lamp-300" />}
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-xs text-bark-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

const inputCls =
  "w-full rounded-lg border border-cream-50/15 bg-night-900/60 px-3 py-2 text-sm text-cream-100 placeholder:text-bark-500 focus:ring-2 focus:ring-lamp-400/40 focus:outline-none"
const labelCls = "mb-1.5 block text-xs font-medium text-bark-400"

export default function PhanThuong() {
  const rootRef = useRef<HTMLDivElement>(null)
  const goalRef = useRef<HTMLDivElement>(null)

  const [xp, setXp] = useState(95)
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    desc: "",
    xp: "",
    type: "personal",
    date: "2026-09-30",
    members: new Set<MemberKey>(),
  })

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (reduced) return
      gsap.fromTo(
        ".fh-fade",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.07, ease: "power3.out" },
      )
    },
    { scope: rootRef },
  )

  const MILESTONE = 150
  const milestonePct = Math.min(100, Math.round((xp / MILESTONE) * 100))

  const GOAL_TARGET = 500
  const GOAL_CURRENT = 420
  const goalPct = Math.round((GOAL_CURRENT / GOAL_TARGET) * 100)

  function redeem(reward: Reward) {
    if (reward.redeemed || xp < reward.cost) return
    setXp((v) => v - reward.cost)
    setRewards((prev) =>
      prev.map((r) => (r.id === reward.id ? { ...r, redeemed: true } : r)),
    )
    toast.success(`Đã đổi "${reward.name}" — tận hưởng nhé! 🎉`)
  }

  function toggleMember(key: MemberKey) {
    setForm((f) => {
      const next = new Set(f.members)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return { ...f, members: next }
    })
  }

  function handleCreateReward() {
    const name = form.name.trim()
    if (!name) {
      toast.error("Vui lòng nhập tên phần thưởng")
      return
    }
    const cost = parseInt(form.xp.replace(/[^\d]/g, ""), 10)
    if (Number.isNaN(cost) || cost <= 0) {
      toast.error("Vui lòng nhập số XP hợp lệ")
      return
    }
    const reward: Reward = {
      id: Date.now(),
      emoji: form.type === "family" ? "🤗" : "🎁",
      name,
      desc:
        form.desc.trim() ||
        (form.type === "family"
          ? "A special treat the whole family enjoys together."
          : "A personal reward chosen by the family."),
      cost,
      redeemed: false,
    }
    setRewards((prev) => [...prev, reward])
    setModalOpen(false)
    setForm({ name: "", desc: "", xp: "", type: "personal", date: "2026-09-30", members: new Set() })
    toast.success(`Phần thưởng "${name}" đã được tạo`)
  }

  const profileStats = [
    { label: "Tuần này", value: "+25 XP", tint: "text-leaf-300" },
    { label: "Việc đã hoàn thành", value: "8", tint: "text-cream-100" },
    { label: "Chuỗi đóng góp", value: "🔥 5 ngày", tint: "text-lamp-300" },
  ]

  const contributions: { key: MemberKey; label: string; xp: number }[] = [
    { key: "dad", label: "Bố", xp: 120 },
    { key: "mom", label: "Mẹ", xp: 150 },
    { key: "minh", label: "Minh", xp: 95 },
    { key: "an", label: "An", xp: 110 },
  ]
  const maxContrib = Math.max(...contributions.map((c) => c.xp))

  return (
    <div ref={rootRef} className="mx-auto max-w-7xl space-y-6">
      <div className="fh-fade flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-cream-50">Phần thưởng</h1>
          <p className="mt-1 text-sm text-bark-400">
            Khen thưởng đóng góp và đạt mục tiêu cùng nhau
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus /> Tạo phần thưởng
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel className="fh-fade">
          <div className="flex items-center gap-4">
            <span className="flex size-16 shrink-0 select-none items-center justify-center rounded-full bg-teal-500/20 text-lg font-bold text-teal-300">
              Mi
            </span>
            <div>
              <p className="font-display text-xl leading-tight text-cream-50">Minh</p>
              <p className="mt-0.5 text-xs text-bark-400">Family member · Level 2</p>
            </div>
          </div>

          <p className="mt-5 font-display text-4xl text-cream-50">
            {xp} <span className="text-base font-medium text-bark-400">XP</span>
          </p>

          <dl className="mt-4 grid grid-cols-1 gap-2.5 rounded-xl border border-cream-50/10 bg-night-900/40 p-3.5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {profileStats.map((s) => (
              <div key={s.label}>
                <dd className={cn("text-sm font-semibold", s.tint)}>{s.value}</dd>
                <dt className="mt-0.5 text-[11px] text-bark-500">{s.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs">
              <p className="font-medium text-bark-400">Next milestone</p>
              <p className="text-bark-500">
                <span className="font-semibold text-lamp-300">{MILESTONE} XP</span> level up
              </p>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-night-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-lamp-500 to-lamp-300 transition-[width] duration-500"
                style={{ width: `${milestonePct}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-bark-500">
              {Math.max(0, MILESTONE - xp)} XP to reach your next milestone ({milestonePct}%)
            </p>
          </div>
        </Panel>

        <div ref={goalRef}>
          <Panel className="fh-fade h-full">
            <SectionHeader
              icon={Target}
              title="Mục tiêu cuối tuần gia đình"
              subtitle="Kiếm cùng nhau — mở khóa phần thưởng như một gia đình"
              action={
                <span className="flex items-center gap-1.5 rounded-full bg-lamp-400/10 px-2.5 py-1 text-xs font-semibold text-lamp-300">
                  {goalPct}% đạt được
                </span>
              }
            />

            <div className="flex flex-wrap items-end justify-between gap-3">
              <p className="font-display text-3xl text-cream-50">
                {GOAL_CURRENT}
                <span className="text-base font-medium text-bark-400"> / {GOAL_TARGET} XP</span>
              </p>
              <div className="flex items-center gap-2.5 rounded-xl border border-lamp-400/25 bg-lamp-400/5 px-3 py-2">
                <span className="text-xl">🎬</span>
                <div>
                  <p className="text-xs font-semibold text-cream-100">Family Movie Night</p>
                  <p className="text-[11px] text-bark-500">Phần thưởng mục tiêu</p>
                </div>
              </div>
            </div>

            <div className="mt-3 h-3.5 w-full overflow-hidden rounded-full bg-night-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-lamp-500 via-lamp-400 to-lamp-300"
                style={{ width: `${goalPct}%` }}
              />
            </div>

<p className="mt-3 text-sm text-bark-400">
              <span className="font-semibold text-lamp-300">{GOAL_TARGET - GOAL_CURRENT} XP</span>{" "}
              còn lại cho đến khi gia đình mở khóa phần thưởng này!
            </p>

            <div className="mt-5 border-t border-cream-50/10 pt-4">
              <p className="mb-2.5 text-[11px] font-medium tracking-wide text-bark-500 uppercase">
                Đóng góp tuần này
              </p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {MEMBERS.map((m) => (
                    <span
                      key={m.key}
                      title={m.label}
                      className={cn(
                        "flex size-9 select-none items-center justify-center rounded-full border-2 border-night-800 text-[10px] font-bold",
                        MEMBER_STYLE[m.key].avatar,
                      )}
                    >
                      {m.initial}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-bark-500">Mọi người đều đã đóng góp — làm việc nhóm tuyệt vời!</p>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel className="fh-fade lg:col-span-2">
          <SectionHeader
            icon={History}
            title="Hoạt động đóng góp"
            subtitle="Những thắng lợi nhỏ được ghi nhận trên khắp gia đình"
          />
          <ul className="divide-y divide-cream-50/5">
            {ACTIVITY.map((a, idx) => {
              const member = MEMBERS.find((m) => m.key === a.member)!
              return (
                <li key={idx} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span
                    className={cn(
                      "flex size-9 shrink-0 select-none items-center justify-center rounded-full text-[10px] font-bold",
                      MEMBER_STYLE[a.member].avatar,
                    )}
                  >
                    {member.initial}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">
                      <span className="font-medium text-cream-100">{member.label}</span>{" "}
                      <span className="text-bark-400">đã hoàn thành</span>{" "}
                      <span className="font-medium text-cream-100">“{a.task}”</span>
                    </p>
                    <p className="mt-0.5 text-xs text-bark-500">{a.time}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-leaf-400/10 px-2.5 py-1 text-xs font-semibold text-leaf-300">
                    +{a.xp} XP
                  </span>
                </li>
              )
            })}
          </ul>
        </Panel>

        <Panel className="fh-fade">
          <SectionHeader
            icon={Users}
            title="Đóng góp gia đình"
            subtitle="Mọi đóng góp đều có giá trị"
          />
          <div className="space-y-4">
            {contributions.map((c) => (
              <div key={c.key}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "flex size-8 select-none items-center justify-center rounded-full text-[10px] font-bold",
                        MEMBER_STYLE[c.key].avatar,
                      )}
                    >
                      {MEMBERS.find((m) => m.key === c.key)?.initial}
                    </span>
                    <p className="text-sm font-medium text-cream-100">{c.label}</p>
                  </div>
                  <p className="text-sm font-semibold text-cream-100">{c.xp} XP</p>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-night-700">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", MEMBER_STYLE[c.key].bar)}
                    style={{ width: `${Math.round((c.xp / maxContrib) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 flex items-start gap-1.5 rounded-lg border border-cream-50/10 bg-night-900/40 p-3 text-[11px] leading-relaxed text-bark-400">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            Tiến độ được chia sẻ, không phải xếp hạng — mọi người đóng góp ở nhịp độ của mình.
          </p>
        </Panel>
      </div>

      <div className="fh-fade">
        <SectionHeader
          icon={Gift}
          title="Phần thưởng có sẵn"
          subtitle={`Đổi lấy bằng ${xp} XP bạn đã kiếm được tháng này`}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {rewards.map((r) => {
            const pct = Math.min(100, Math.round((xp / r.cost) * 100))
            const canRedeem = !r.redeemed && xp >= r.cost
            const remaining = Math.max(0, r.cost - xp)
            return (
              <Panel key={r.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-night-700 text-xl">
                    {r.emoji}
                  </span>
                  {r.redeemed ? (
                    <span className="rounded-full bg-leaf-400/10 px-2 py-1 text-[10px] font-semibold text-leaf-300">
                      Đã đổi ✓
                    </span>
                  ) : (
                    <span className="rounded-full bg-lamp-400/10 px-2 py-1 text-[10px] font-semibold text-lamp-300">
                      {r.cost} XP
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold text-cream-100">{r.name}</p>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-bark-500">{r.desc}</p>

                {!r.redeemed && (
                  <>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-night-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-lamp-300 transition-[width] duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-bark-500">
                      {canRedeem ? "Đã mở khóa — sẵn sàng đổi!" : `${remaining} XP để mở khóa`}
                    </p>
                  </>
                )}

                <Button
                  variant={canRedeem ? "default" : "secondary"}
                  size="sm"
                  className="mt-4 w-full"
                  disabled={!canRedeem}
                  onClick={() => redeem(r)}
                >
{r.redeemed ? (
                      <>
                        <Check /> Đã đổi
                      </>
                    ) : canRedeem ? (
                      "Đổi lấy"
                    ) : (
                      <>
                        <Lock /> Đã khóa
                      </>
                    )}
                </Button>
              </Panel>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel className="fh-fade lg:col-span-2">
          <SectionHeader
            icon={Trophy}
            title="Thành tựu"
            subtitle="Các cột mốc gia đình mở khóa cùng nhau theo thời gian"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {BADGES.map((b) => (
              <div
                key={b.name}
                className={cn(
                  "flex items-start gap-3.5 rounded-xl border p-4 transition-colors",
                  b.state === "unlocked"
                    ? "border-lamp-400/30 bg-lamp-400/5"
                    : "border-cream-50/10 bg-night-900/40",
                )}
              >
                <span
                  className={cn(
                    "flex size-12 shrink-0 select-none items-center justify-center rounded-full text-2xl",
                    b.state === "unlocked" ? "bg-lamp-400/15" : "bg-night-700 opacity-45 grayscale",
                  )}
                >
                  {b.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-cream-100">{b.name}</p>
                    {b.state === "unlocked" ? (
                      <span className="shrink-0 rounded-full bg-lamp-400/15 px-2 py-0.5 text-[10px] font-semibold text-lamp-300">
                        Đã mở khóa
                      </span>
                    ) : (
                      <Lock className="size-3.5 shrink-0 text-bark-500" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-bark-500">{b.desc}</p>
                  {b.state === "locked" && (
                    <div className="mt-2.5">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-night-700">
                        <div
                          className="h-full rounded-full bg-bark-500"
                          style={{ width: `${Math.round((b.progress / b.target) * 100)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] text-bark-500">
                        {b.progress}/{b.target} · tiếp tục nhé!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <section className="relative fh-fade overflow-hidden rounded-xl border border-lamp-400/20 bg-night-800/60 p-5 backdrop-blur-sm sm:p-6">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(244,189,92,0.06), transparent 55%)",
            }}
          />
          <div className="relative flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lamp-400/20 text-lamp-300">
              <Sparkles className="size-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-cream-50">Gợi ý của Family AI</h3>
              <p className="text-xs text-bark-500">Được tạo bởi Family AI</p>
            </div>
          </div>

          <div className="relative mt-5 flex items-start gap-2.5 rounded-lg border border-cream-50/10 bg-night-900/50 p-3.5">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-lamp-300" />
            <p className="text-sm leading-relaxed text-cream-100">
              Gia đình bạn chỉ còn{" "}
              <span className="font-semibold text-lamp-300">{GOAL_TARGET - GOAL_CURRENT} XP</span>{" "}
              để đạt mục tiêu cuối tuần. Hoàn thành thêm 5 việc nhà có thể giúp mở khóa nó.
            </p>
          </div>

          <p className="relative mt-3 text-xs leading-relaxed text-bark-400">
            Không áp lực — mọi việc nhỏ đều cộng dồn, và cả gia đình cùng ăn mừng phần thưởng
            cùng nhau.
          </p>

          <Button
            variant="secondary"
            size="sm"
            className="relative mt-5 w-full"
            onClick={() => {
              goalRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
              toast.info("Việc gợi ý: Tưới cây (+10 XP), Gấp quần áo (+10 XP), Quét sàn (+10 XP)…")
            }}
          >
            Xem việc gợi ý
          </Button>

          <p className="relative mt-4 flex items-center gap-1.5 text-[11px] text-bark-500">
            <Info className="size-3.5 shrink-0" />
            Family AI đưa ra gợi ý — gia đình bạn quyết định.
          </p>
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            aria-label="Đóng"
            className="absolute inset-0 bg-night-950/70 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-2xl border border-cream-50/15 bg-night-800 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-cream-50">Tạo phần thưởng</h3>
                <p className="mt-0.5 text-xs text-bark-500">
                  Thêm điều gì đó thú vị mà gia đình có thể nỗ lực đạt được
                </p>
              </div>
              <button
                aria-label="Đóng"
                onClick={() => setModalOpen(false)}
                className="text-bark-400 hover:text-cream-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>Tên phần thưởng</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Chọn phim gia đình"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Mô tả</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả phần thưởng bao gồm gì…"
                  value={form.desc}
                  onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                  className={cn(inputCls, "resize-none")}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>XP cần thiết</label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={form.xp}
                      onChange={(e) => setForm((f) => ({ ...f, xp: e.target.value }))}
                      className={cn(inputCls, "pr-10")}
                    />
                    <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-bark-500">
                      XP
                    </span>
                  </div>
                </div>
<div>
                <label className={labelCls}>Ngày hết hạn</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Loại phần thưởng</label>
              <div className="grid grid-cols-2 gap-1 rounded-lg border border-cream-50/10 bg-night-900/60 p-1">
                {(["personal", "family"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors",
                      form.type === t
                        ? "bg-lamp-400/15 text-lamp-300"
                        : "text-bark-400 hover:text-cream-100",
                    )}
                  >
                    {t === "personal" ? "Cá nhân" : "Gia đình"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Thành viên tham gia</label>
                <div className="flex flex-wrap gap-2">
                  {MEMBERS.map((m) => {
                    const selected = form.members.has(m.key)
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => toggleMember(m.key)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border py-1.5 pr-3 pl-1.5 text-xs font-medium transition-colors",
                          selected
                            ? "border-lamp-400/40 bg-lamp-400/10 text-lamp-300"
                            : "border-cream-50/10 text-bark-400 hover:border-cream-50/25 hover:text-cream-100",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-5 select-none items-center justify-center rounded-full text-[9px] font-bold",
                            MEMBER_STYLE[m.key].avatar,
                          )}
                        >
                          {selected ? <Check className="size-3" /> : m.initial}
                        </span>
                        {m.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Button className="w-full" onClick={handleCreateReward}>
                <Plus /> Tạo phần thưởng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
