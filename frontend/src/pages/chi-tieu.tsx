import { useRef, useState } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { toast } from "sonner"
import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpFromLine,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Coins,
  Info,
  PieChart,
  PiggyBank,
  Plus,
  Repeat,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MemberKey } from "@/context/data-context"

gsap.registerPlugin(useGSAP)

type TxType = "income" | "expense"
type TxStatus = "on" | "near"

type Stat = {
  label: string
  amount: number
  delta: string
  up: boolean
  tone: string
  icon: LucideIcon
  iconTone: string
}

type Tx = {
  id: number
  emoji: string
  title: string
  member: MemberKey
  date: string
  time: string
  amount: number
  type: TxType
  cat: string
}

const vnd = (n: number) => n.toLocaleString("en-US")

const STATS: Stat[] = [
  {
    label: "Tổng thu nhập",
    amount: 27_000_000,
    delta: "+8%",
    up: true,
    tone: "bg-leaf-400/10 text-leaf-300",
    icon: ArrowDownToLine,
    iconTone: "bg-leaf-400/10 text-leaf-300",
  },
  {
    label: "Tổng chi tiêu",
    amount: 17_500_000,
    delta: "+5%",
    up: true,
    tone: "bg-wine-400/10 text-wine-300",
    icon: ArrowUpFromLine,
    iconTone: "bg-wine-400/10 text-wine-300",
  },
  {
    label: "Số dư còn lại",
    amount: 9_500_000,
    delta: "+18%",
    up: true,
    tone: "bg-leaf-400/10 text-leaf-300",
    icon: PiggyBank,
    iconTone: "bg-lamp-400/10 text-lamp-300",
  },
  {
    label: "Tiết kiệm",
    amount: 5_000_000,
    delta: "-12%",
    up: false,
    tone: "bg-lamp-400/10 text-lamp-300",
    icon: Coins,
    iconTone: "bg-purple-500/20 text-purple-300",
  },
]

const MONTHS = [
  { label: "Mar", income: 24, expense: 16, savings: 8 },
  { label: "Apr", income: 26, expense: 18, savings: 8 },
  { label: "May", income: 22, expense: 15, savings: 7 },
  { label: "Jun", income: 25, expense: 19, savings: 6 },
  { label: "Jul", income: 28, expense: 16, savings: 12 },
  { label: "Aug", income: 27, expense: 17.5, savings: 9.5 },
]

const BARS = [
  { key: "income", label: "Thu nhập", color: "bg-emerald-400", dot: "bg-emerald-400" },
  { key: "expense", label: "Chi tiêu", color: "bg-rose-400", dot: "bg-rose-400" },
  { key: "savings", label: "Tiết kiệm", color: "bg-lamp-400", dot: "bg-lamp-400" },
] as const

const CATEGORY_DATA = [
  { label: "Thực phẩm & Tạp hóa", amount: 6_000_000, color: "#818cf8" },
  { label: "Nhà ở", amount: 4_500_000, color: "#c084fc" },
  { label: "Giáo dục", amount: 3_000_000, color: "#60a5fa" },
  { label: "Tiện ích", amount: 1_500_000, color: "#22d3ee" },
  { label: "Di chuyển", amount: 1_200_000, color: "#34d399" },
  { label: "Mua sắm", amount: 800_000, color: "#fbbf24" },
  { label: "Giải trí", amount: 300_000, color: "#f472b6" },
  { label: "Khác", amount: 200_000, color: "#94a3b8" },
]

const TOTAL_EXPENSE = CATEGORY_DATA.reduce((sum, c) => sum + c.amount, 0)

const CATEGORY_BUDGETS: { label: string; spent: number; budget: number; status: TxStatus }[] = [
  { label: "Thực phẩm", spent: 6_000_000, budget: 8_000_000, status: "near" },
  { label: "Giáo dục", spent: 3_000_000, budget: 4_000_000, status: "near" },
  { label: "Tiện ích", spent: 1_500_000, budget: 2_000_000, status: "on" },
  { label: "Mua sắm", spent: 2_000_000, budget: 3_000_000, status: "on" },
]

const GOALS = [
  { emoji: "🏖️", title: "Nghỉ dưỡng gia đình", saved: 12_000_000, target: 20_000_000 },
  { emoji: "🏠", title: "Cải tạo nhà", saved: 8_000_000, target: 15_000_000 },
]

const MEMBERS: { key: MemberKey; label: string }[] = [
  { key: "dad", label: "Bố" },
  { key: "mom", label: "Mẹ" },
  { key: "minh", label: "Minh" },
  { key: "an", label: "An" },
]

const MEMBER_STYLE: Record<MemberKey, { chip: string }> = {
  dad: { chip: "bg-blue-500/15 text-blue-300" },
  mom: { chip: "bg-purple-500/15 text-purple-300" },
  minh: { chip: "bg-teal-500/15 text-teal-300" },
  an: { chip: "bg-pink-500/15 text-pink-300" },
  family: { chip: "bg-lamp-400/15 text-lamp-300" },
}

const CATEGORY_EMOJI: Record<string, string> = {
  "Thực phẩm & Tạp hóa": "🛒",
  "Nhà ở": "🏠",
  "Giáo dục": "🎓",
  "Tiện ích": "💡",
  "Di chuyển": "⛽",
  "Mua sắm": "🛍️",
  "Giải trí": "🎬",
  "Khác": "💸",
  "Lương": "💼",
}

const PAYMENT_METHODS = ["Tiền mặt", "Chuyển khoản", "Ví điện tử", "Thẻ tín dụng"]

const INITIAL_TX: Tx[] = [
  { id: 1, emoji: "🛒", title: "Siêu thị", member: "mom", date: "Hôm nay", time: "4:20 PM", amount: 850_000, type: "expense", cat: "Thực phẩm & Tạp hóa" },
  { id: 2, emoji: "🎓", title: "Học phí Toán", member: "dad", date: "Hôm qua", time: "6:00 PM", amount: 1_200_000, type: "expense", cat: "Giáo dục" },
  { id: 3, emoji: "💼", title: "Lương tháng", member: "dad", date: "1 Thg 8", time: "9:00 AM", amount: 15_000_000, type: "income", cat: "Lương" },
  { id: 4, emoji: "💼", title: "Lương tháng", member: "mom", date: "1 Thg 8", time: "9:00 AM", amount: 12_000_000, type: "income", cat: "Lương" },
  { id: 5, emoji: "⛽", title: "Xăng xe", member: "dad", date: "2 Thg 8", time: "5:30 PM", amount: 700_000, type: "expense", cat: "Di chuyển" },
  { id: 6, emoji: "💡", title: "Tiền điện", member: "family", date: "28 Thg 7", time: "8:00 AM", amount: 900_000, type: "expense", cat: "Tiện ích" },
]

const BUDGET_TOTAL = 23_000_000
const BUDGET_SPENT = 17_500_000
const BUDGET_PCT = Math.round((BUDGET_SPENT / BUDGET_TOTAL) * 100)

function Panel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
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

export default function ChiTieu() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [transactions, setTransactions] = useState<Tx[]>(INITIAL_TX)
  const [form, setForm] = useState({
    type: "expense" as TxType,
    amount: "",
    category: "Food & Groceries",
    description: "",
    date: "2026-08-16",
    member: "dad" as MemberKey,
    payment: "Cash",
    recurring: false,
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

  function handleAdd() {
    const amount = parseInt(form.amount.replace(/[^0-9]/g, ""), 10)
    if (!amount || amount <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ")
      return
    }
    const tx: Tx = {
      id: Date.now(),
      emoji: CATEGORY_EMOJI[form.category] ?? "💸",
      title: form.description.trim() || (form.type === "income" ? "Thu nhập" : "Chi tiêu"),
      member: form.member,
      date: "Hôm nay",
      time: new Date().toLocaleTimeString("vi-VN", { hour: "numeric", minute: "2-digit" }),
      amount,
      type: form.type,
      cat: form.category,
    }
    setTransactions((prev) => [tx, ...prev])
    toast.success("Đã thêm giao dịch thành công")
    setModalOpen(false)
    setForm({
      type: "expense",
      amount: "",
      category: "Thực phẩm & Tạp hóa",
      description: "",
      date: "2026-08-16",
      member: "dad",
      payment: "Cash",
      recurring: false,
    })
  }

  return (
    <div ref={rootRef} className="mx-auto max-w-7xl space-y-6">
      <div className="fh-fade flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-cream-50">Chi tiêu</h1>
          <p className="mt-1 text-sm text-bark-400">
            Theo dõi và quản lý tài chính gia đình
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-lg border border-cream-50/10 bg-night-800/60 px-1.5 py-1">
            <button className="flex size-6 items-center justify-center rounded-md text-bark-400 hover:bg-cream-50/5 hover:text-cream-100">
              <ChevronLeft className="size-4" />
            </button>
            <span className="px-1 text-sm font-semibold text-cream-100">Tháng 8 2026</span>
            <button className="flex size-6 items-center justify-center rounded-md text-bark-400 hover:bg-cream-50/5 hover:text-cream-100">
              <ChevronRight className="size-4" />
            </button>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus /> Thêm giao dịch
          </Button>
        </div>
      </div>

      <div className="fh-fade grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <Panel key={s.label}>
            <div className="flex items-start justify-between">
              <span
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl",
                  s.iconTone,
                )}
              >
                <s.icon className="size-5" />
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold",
                  s.tone,
                )}
              >
                {s.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {s.delta}
              </span>
            </div>
            <p className="mt-4 font-display text-2xl text-cream-50">{vnd(s.amount)}</p>
            <p className="mt-1 text-xs text-bark-400">{s.label} · VND</p>
            <p className="mt-2 text-[11px] text-bark-500">vs last month</p>
          </Panel>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel className="fh-fade lg:col-span-2">
          <SectionHeader
            icon={BarChart3}
            title="Thu nhập vs Chi tiêu"
            subtitle="Tổng quan tài chính hàng tháng qua các tháng gần đây"
            action={
              <div className="flex items-center gap-3">
                {BARS.map((b) => (
                  <span
                    key={b.key}
                    className="flex items-center gap-1.5 text-xs text-bark-400"
                  >
                    <span className={cn("size-2.5 rounded-full", b.dot)} />
                    {b.label}
                  </span>
                ))}
              </div>
            }
          />
          <div className="relative h-52 pl-9">
            {[30, 20, 10, 0].map((level) => (
              <div
                key={level}
                className="absolute inset-x-0 flex items-center gap-2"
                style={{
                  top: level === 0 ? "100%" : `${100 - (level / 30) * 100}%`,
                  transform: "translateY(-50%)",
                }}
              >
                <span className="w-9 shrink-0 text-right text-[10px] font-medium text-bark-500">
                  {level}M
                </span>
                <div
                  className={cn(
                    "h-px flex-1",
                    level === 0 ? "bg-cream-50/20" : "border-t border-dashed border-cream-50/10",
                  )}
                />
              </div>
            ))}

            <div className="absolute inset-0 bottom-0 flex items-end justify-around gap-1.5 px-1 pt-2">
              {MONTHS.map((m) => (
                <div key={m.label} className="flex h-full flex-1 flex-col items-center">
                  <div className="flex h-[calc(100%-1.75rem)] w-full items-end justify-center gap-1 sm:gap-1.5">
                    {BARS.map((b, i) => {
                      const v = i === 0 ? m.income : i === 1 ? m.expense : m.savings
                      return (
                        <div
                          key={b.key}
                          title={`${b.label}: ${v}M`}
                          className={cn(
                            "w-full max-w-4 rounded-t-md transition-all hover:brightness-110",
                            b.color,
                          )}
                          style={{ height: `${(v / 30) * 100}%` }}
                        />
                      )
                    })}
                  </div>
                  <span className="mt-1.5 text-[11px] font-medium text-bark-400">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel className="fh-fade">
          <SectionHeader icon={PieChart} title="Chi tiêu theo danh mục" subtitle="Phân bổ tháng 8 2026" />
          <div className="relative mx-auto size-44">
            <svg viewBox="0 0 150 150" className="size-full -rotate-90">
              {(() => {
                const R = 52
                const C = 2 * Math.PI * R
                let acc = 0
                return CATEGORY_DATA.map((seg) => {
                  const len = (seg.amount / TOTAL_EXPENSE) * C
                  const el = (
                    <circle
                      key={seg.label}
                      cx="75"
                      cy="75"
                      r={R}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="18"
                      strokeDasharray={`${len} ${C - len}`}
                      strokeDashoffset={-acc}
                    />
                  )
                  acc += len
                  return el
                })
              })()}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[11px] font-medium text-bark-500">Tổng đã chi</p>
              <p className="font-display text-xl text-cream-50">
                {(TOTAL_EXPENSE / 1_000_000).toFixed(1)}M
              </p>
              <span className="mt-1 rounded-full bg-night-700 px-2 py-0.5 text-[10px] font-semibold text-bark-400">
                VND
              </span>
            </div>
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {CATEGORY_DATA.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-cream-100">{c.label}</p>
                  <p className="text-[10px] text-bark-500">
                    {Math.round((c.amount / TOTAL_EXPENSE) * 100)}% ·{" "}
                    {(c.amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel className="fh-fade lg:col-span-2">
          <SectionHeader
            icon={Wallet}
            title="Ngân sách tháng"
            subtitle="Hạn mức chi tiêu tổng của gia đình tháng 8"
            action={
              <span className="flex items-center gap-1.5 rounded-full bg-lamp-400/10 px-2.5 py-1 text-xs font-semibold text-lamp-300">
                {BUDGET_PCT}% đã dùng
              </span>
            }
          />
          <div>
            <div className="flex items-end justify-between">
              <p className="font-display text-2xl text-cream-50">
                {vnd(BUDGET_SPENT)}{" "}
                <span className="text-sm font-medium text-bark-400">
                  / {vnd(BUDGET_TOTAL)} VND
                </span>
              </p>
              <p className="text-xs text-bark-400">
                <span className="font-semibold text-leaf-300">
                  {vnd(BUDGET_TOTAL - BUDGET_SPENT)}
                </span>{" "}
                còn lại
              </p>
            </div>
            <div className="mt-3 h-3.5 w-full overflow-hidden rounded-full bg-night-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-lamp-500 to-lamp-300"
                style={{ width: `${BUDGET_PCT}%` }}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CATEGORY_BUDGETS.map((c) => {
              const pct = Math.round((c.spent / c.budget) * 100)
              const near = c.status === "near"
              return (
                <div
                  key={c.label}
                  className={cn(
                    "rounded-xl border p-4",
                    near ? "border-lamp-400/30 bg-lamp-400/5" : "border-cream-50/10 bg-night-900/40",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-cream-100">{c.label}</p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        near ? "bg-lamp-400/10 text-lamp-300" : "bg-leaf-400/10 text-leaf-300",
                      )}
                    >
                      {near ? "Gần hết hạn" : "Đang ổn"}
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-baseline justify-between text-xs">
                    <span className="text-bark-400">
                      <span className="font-semibold text-cream-100">{vnd(c.spent)}</span> /{" "}
                      {vnd(c.budget)} VND
                    </span>
                    <span className="font-semibold text-bark-400">{pct}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-night-700">
                    <div
                      className={cn("h-full rounded-full", near ? "bg-lamp-400" : "bg-leaf-400")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>

<Panel className="fh-fade">
          <SectionHeader icon={Target} title="Mục tiêu gia đình" subtitle="Tiết kiệm cùng nhau như một gia đình" />
          <div className="space-y-6">
            {GOALS.map((g) => {
              const pct = Math.round((g.saved / g.target) * 100)
              return (
                <div key={g.title}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-night-700 text-xl">
                        {g.emoji}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-cream-100">{g.title}</p>
                        <p className="mt-0.5 text-xs text-bark-400">
                          {vnd(g.saved)} / {vnd(g.target)} VND
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-lamp-300">{pct}%</span>
                  </div>
                  <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-night-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-leaf-500 to-leaf-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-bark-500">
                    {vnd(g.target - g.saved)} VND để hoàn thành
                  </p>
                </div>
              )
            })}
          </div>
          <Button variant="secondary" size="sm" className="mt-6 w-full">
            Quản lý mục tiêu <ArrowRight />
          </Button>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
<Panel className="fh-fade lg:col-span-2">
          <div className="mb-4">
            <SectionHeader
              icon={ArrowLeftRight}
              title="Giao dịch gần đây"
              subtitle="Hoạt động mới nhất của gia đình"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-y border-cream-50/10 text-[11px] font-medium tracking-widest text-bark-500 uppercase">
                  <th className="py-3 pr-3 pl-1 font-medium">Giao dịch</th>
                  <th className="hidden px-3 py-3 font-medium sm:table-cell">Thành viên</th>
                  <th className="hidden px-3 py-3 font-medium md:table-cell">Ngày & giờ</th>
                  <th className="px-3 py-3 text-right font-medium">Số tiền</th>
                  <th className="py-3 pl-3 pr-1 text-right font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-cream-50/5 transition-colors last:border-0 hover:bg-cream-50/5"
                  >
                    <td className="py-3 pr-3 pl-1">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-night-700 text-lg">
                          {tx.emoji}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-cream-100">
                            {tx.title}
                          </p>
                          <p className="text-xs text-bark-500">{tx.cat}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-3 py-3 sm:table-cell">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                          MEMBER_STYLE[tx.member].chip,
                        )}
                      >
                        {MEMBERS.find((m) => m.key === tx.member)?.label}
                      </span>
                    </td>
                    <td className="hidden px-3 py-3 text-sm text-bark-400 md:table-cell">
                      {tx.date}
                      {tx.time && (
                        <span className="block text-xs text-bark-500">{tx.time}</span>
                      )}
                    </td>
                    <td
                      className={cn(
                        "px-3 py-3 text-right text-sm font-semibold whitespace-nowrap",
                        tx.type === "income" ? "text-leaf-300" : "text-wine-300",
                      )}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {vnd(tx.amount)}
                    </td>
                    <td className="py-3 pl-3 pr-1 text-right">
                      <span
                        className={cn(
                          "inline-block rounded-full px-2 py-1 text-[10px] font-semibold",
                          tx.type === "income"
                            ? "bg-leaf-400/10 text-leaf-300"
                            : "bg-wine-400/10 text-wine-300",
                        )}
                      >
                        {tx.type === "income" ? "Thu nhập" : "Chi tiêu"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button variant="secondary" size="sm" className="mt-4 w-full">
            Xem tất cả giao dịch <ArrowRight />
          </Button>
        </Panel>

        <section className="relative overflow-hidden rounded-xl border border-lamp-400/20 bg-night-800/60 p-5 backdrop-blur-sm sm:p-6">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(244,189,92,0.5), transparent)",
            }}
          />
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lamp-400/20 text-lamp-300">
              <Sparkles className="size-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-cream-50">Gợi ý tài chính thông minh</h3>
              <p className="text-xs text-bark-500">Được tạo bởi Family AI</p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed font-medium text-cream-100">
            Chi tiêu thực phẩm của gia đình cao hơn ngân sách đã lên kế hoạch tháng này.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-bark-400">
            Chi tiêu thực phẩm đã đạt 75% ngân sách tháng, trong khi còn 15 ngày trong tháng 8.
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" size="sm" className="flex-1">
              Xem chi tiết
            </Button>
            <Button size="sm" className="flex-1">
              Hỏi Family AI
            </Button>
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-[11px] text-bark-500">
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
          <div className="relative w-full max-w-lg rounded-2xl border border-cream-50/15 bg-night-800 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-cream-50">Thêm giao dịch</h3>
                <p className="mt-0.5 text-xs text-bark-500">
                  Ghi nhận thu nhập hoặc chi tiêu cho gia đình
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
<div className="grid grid-cols-2 gap-1 rounded-lg border border-cream-50/10 bg-night-900/60 p-1">
                <button
                  onClick={() => setForm((f) => ({ ...f, type: "expense" }))}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    form.type === "expense"
                      ? "bg-wine-400/15 text-wine-300"
                      : "text-bark-400 hover:text-cream-100",
                  )}
                >
                  Chi tiêu
                </button>
                <button
                  onClick={() => setForm((f) => ({ ...f, type: "income" }))}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    form.type === "income"
                      ? "bg-leaf-400/15 text-leaf-300"
                      : "text-bark-400 hover:text-cream-100",
                  )}
                >
                  Thu nhập
                </button>
              </div>

              <div>
                <label className={labelCls}>Số tiền</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    className={cn(inputCls, "pr-16 font-semibold")}
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-bark-500">
                    VND
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Danh mục</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className={inputCls}
                  >
                    {CATEGORY_DATA.map((c) => (
                      <option key={c.label} value={c.label}>
                        {c.label}
                      </option>
                    ))}
                    <option value="Lương">Lương</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Ngày</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Mô tả</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Mua sắm hàng tuần"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Thành viên</label>
                  <select
                    value={form.member}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, member: e.target.value as MemberKey }))
                    }
                    className={inputCls}
                  >
                    {MEMBERS.map((m) => (
                      <option key={m.key} value={m.key}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Phương thức thanh toán</label>
                  <select
                    value={form.payment}
                    onChange={(e) => setForm((f) => ({ ...f, payment: e.target.value }))}
                    className={inputCls}
                  >
                    {PAYMENT_METHODS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setForm((f) => ({ ...f, recurring: !f.recurring }))}
                className="flex w-full items-center justify-between rounded-lg border border-cream-50/10 bg-night-900/40 px-3 py-2.5 text-left transition-colors hover:border-cream-50/20"
              >
                <span className="flex items-center gap-2 text-sm text-cream-100">
                  <Repeat className="size-4 text-bark-400" />
                  Giao dịch định kỳ
                </span>
                <span
                  className={cn(
                    "relative h-5.5 w-10 rounded-full transition-colors",
                    form.recurring ? "bg-lamp-400" : "bg-night-700",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 size-4.5 rounded-full bg-white shadow transition-transform",
                      form.recurring && "translate-x-[18px]",
                    )}
                  />
                </span>
              </button>

              <Button
                className={cn(
                  "w-full",
                  form.type === "income" &&
                    "bg-leaf-400 text-night-900 shadow-lg shadow-leaf-500/20 hover:bg-leaf-300",
                )}
                onClick={handleAdd}
              >
                <Plus />
                Thêm {form.type === "income" ? "Thu nhập" : "Giao dịch"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}