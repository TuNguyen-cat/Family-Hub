import { useMemo, useRef, useState } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { toast } from "sonner"
import {
  Check,
  CheckCheck,
  ClipboardList,
  Copy,
  Info,
  Lightbulb,
  MoreHorizontal,
  Plus,
  ShoppingCart,
  ShoppingBasket,
  Sparkles,
  Trash2,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MemberKey, Priority } from "@/context/data-context"

gsap.registerPlugin(useGSAP)

type CatKey = "food" | "household" | "personal" | "education" | "other"

type Item = {
  id: number
  name: string
  emoji: string
  cat: CatKey
  qty: string
  price: number
  member: MemberKey
  priority: Priority
  done: boolean
}

type SList = {
  id: number
  emoji: string
  name: string
  desc: string
  budget: number
  date: string
  repeat: string
  items: Item[]
}

const vnd = (n: number) => n.toLocaleString("en-US")

const MEMBERS: { key: MemberKey; label: string; initial: string }[] = [
  { key: "dad", label: "Bố", initial: "B" },
  { key: "mom", label: "Mẹ", initial: "M" },
  { key: "minh", label: "Minh", initial: "Mi" },
  { key: "an", label: "An", initial: "A" },
]

const MEMBER_STYLE: Record<MemberKey, { chip: string; avatar: string }> = {
  dad: { chip: "bg-blue-500/15 text-blue-300", avatar: "bg-blue-500/20 text-blue-300" },
  mom: { chip: "bg-purple-500/15 text-purple-300", avatar: "bg-purple-500/20 text-purple-300" },
  minh: { chip: "bg-teal-500/15 text-teal-300", avatar: "bg-teal-500/20 text-teal-300" },
  an: { chip: "bg-pink-500/15 text-pink-300", avatar: "bg-pink-500/20 text-pink-300" },
  family: { chip: "bg-lamp-400/15 text-lamp-300", avatar: "bg-lamp-400/20 text-lamp-300" },
}

const PRIORITY_STYLE: Record<Priority, { label: string; chip: string; dot: string }> = {
  low: { label: "Thấp", chip: "bg-leaf-400/10 text-leaf-300", dot: "bg-leaf-400" },
  medium: { label: "Trung bình", chip: "bg-lamp-400/10 text-lamp-300", dot: "bg-lamp-400" },
  high: { label: "Cao", chip: "bg-wine-400/10 text-wine-300", dot: "bg-wine-400" },
}

const CAT_META: Record<CatKey, { label: string; emoji: string }> = {
  food: { label: "Thực phẩm", emoji: "🍎" },
  household: { label: "Gia đình", emoji: "🧹" },
  personal: { label: "Chăm sóc cá nhân", emoji: "🧼" },
  education: { label: "Giáo dục", emoji: "📚" },
  other: { label: "Khác", emoji: "🛍️" },
}

const FILTERS: { key: CatKey | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "food", label: "Thực phẩm" },
  { key: "household", label: "Gia đình" },
  { key: "personal", label: "Chăm sóc cá nhân" },
  { key: "education", label: "Giáo dục" },
  { key: "other", label: "Khác" },
]

const REPEAT_OPTIONS = ["Không lặp", "Hàng ngày", "Hàng tuần", "Hàng tháng"]

const KEYWORDS: Record<CatKey, string[]> = {
  food: ["rice", "milk", "egg", "bread", "meat", "chicken", "fish", "veg", "fruit", "noodle", "oil", "snack", "cake", "yog", "juice", "cheese", "sugar", "salt"],
  household: ["dish", "detergent", "trash", "tissue", "cleaner", "battery", "towel", "soap", "lamp", "bag"],
  personal: ["shampoo", "toothpaste", "deodorant", "razor", "lotion", "comb", "perfume"],
  education: ["pen", "pencil", "notebook", "book", "eraser", "ruler", "marker"],
  other: [],
}

function guessCat(name: string): CatKey {
  const n = name.toLowerCase()
  for (const key of Object.keys(KEYWORDS) as CatKey[]) {
    if (KEYWORDS[key].some((k) => n.includes(k))) return key
  }
  return "other"
}

const INITIAL_LISTS: SList[] = [
  {
    id: 1,
    emoji: "🛒",
    name: "Mua sắm hàng tuần",
    desc: "Thực phẩm và đồ thiết yếu cho tuần",
    budget: 3_000_000,
    date: "2026-08-23",
    repeat: "Hàng tuần",
    items: [
      { id: 101, name: "Gạo", emoji: "🍚", cat: "food", qty: "5 kg", price: 150_000, member: "dad", priority: "high", done: false },
      { id: 102, name: "Sữa", emoji: "🥛", cat: "food", qty: "2 hộp", price: 80_000, member: "mom", priority: "medium", done: false },
      { id: 103, name: "Trứng", emoji: "🥚", cat: "food", qty: "1 khay", price: 50_000, member: "minh", priority: "low", done: true },
      { id: 104, name: "Rau củ", emoji: "🥬", cat: "food", qty: "2 kg", price: 100_000, member: "mom", priority: "medium", done: false },
      { id: 105, name: "Nước rửa chén", emoji: "🧴", cat: "household", qty: "1 chai", price: 75_000, member: "an", priority: "low", done: false },
      { id: 106, name: "Ức gà", emoji: "🍗", cat: "food", qty: "2 kg", price: 270_000, member: "mom", priority: "high", done: false },
      { id: 107, name: "Dầu ăn", emoji: "🫒", cat: "food", qty: "2 chai", price: 195_000, member: "dad", priority: "medium", done: false },
      { id: 108, name: "Sữa bột", emoji: "🍼", cat: "other", qty: "2 hộp", price: 650_000, member: "mom", priority: "high", done: false },
      { id: 109, name: "Giỏ trái cây", emoji: "🍎", cat: "food", qty: "1 giỏ", price: 80_000, member: "minh", priority: "low", done: false },
      { id: 110, name: "Sữa chua", emoji: "🍦", cat: "food", qty: "8 ly", price: 95_000, member: "an", priority: "low", done: true },
      { id: 111, name: "Bột giặt", emoji: "🧺", cat: "household", qty: "1 hộp", price: 185_000, member: "dad", priority: "low", done: true },
      { id: 112, name: "Dầu gội", emoji: "🧴", cat: "personal", qty: "2 chai", price: 250_000, member: "mom", priority: "low", done: true },
      { id: 113, name: "Nước cam", emoji: "🍊", cat: "food", qty: "4 hộp", price: 200_000, member: "minh", priority: "medium", done: true },
      { id: 114, name: "Vở", emoji: "📓", cat: "education", qty: "10 cuốn", price: 120_000, member: "an", priority: "medium", done: true },
    ],
  },
  {
    id: 2,
    emoji: "🎂",
    name: "Tiệc sinh nhật",
    desc: "Tiệc sinh nhật An thứ 7 tuần sau",
    budget: 2_000_000,
    date: "2026-08-29",
    repeat: "Không lặp",
    items: [
      { id: 201, name: "Bánh sinh nhật", emoji: "🎂", cat: "other", qty: "1 bánh", price: 480_000, member: "mom", priority: "high", done: false },
      { id: 202, name: "Bóng bay & trang trí", emoji: "🎈", cat: "other", qty: "1 bộ", price: 140_000, member: "an", priority: "medium", done: false },
      { id: 203, name: "Đồ ăn vặt & kẹo", emoji: "🍬", cat: "food", qty: "1 khay", price: 130_000, member: "minh", priority: "low", done: false },
      { id: 204, name: "Mũ tiệc", emoji: "🎉", cat: "other", qty: "12 cái", price: 60_000, member: "an", priority: "low", done: true },
    ],
  },
  {
    id: 3,
    emoji: "🏖️",
    name: "Du lịch gia đình",
    desc: "Danh sách đồ đi Đà Lạt cuối tuần",
    budget: 1_000_000,
    date: "2026-09-05",
    repeat: "Không lặp",
    items: [
      { id: 301, name: "Kem chống nắng", emoji: "🧴", cat: "personal", qty: "2 chai", price: 150_000, member: "dad", priority: "medium", done: false },
      { id: 302, name: "Khăn tắm biển", emoji: "🏖️", cat: "other", qty: "2 chiếc", price: 120_000, member: "minh", priority: "low", done: true },
    ],
  },
]

const ACTIVITY: { member: MemberKey; verb: string; item: string; time: string }[] = [
  { member: "mom", verb: "đã thêm", item: "Sữa", time: "5 phút trước" },
  { member: "dad", verb: "đã mua", item: "Gạo", time: "25 phút trước" },
  { member: "minh", verb: "đã hoàn thành", item: "Trứng", time: "1 giờ trước" },
  { member: "an", verb: "đã thêm", item: "Nước rửa chén", time: "2 giờ trước" },
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

export default function MuaSam() {
  const rootRef = useRef<HTMLDivElement>(null)
  const quickRef = useRef<HTMLInputElement>(null)
  const budgetRef = useRef<HTMLDivElement>(null)

  const [lists, setLists] = useState<SList[]>(INITIAL_LISTS)
  const [activeId, setActiveId] = useState(1)
  const [catFilter, setCatFilter] = useState<CatKey | "all">("all")
  const [quick, setQuick] = useState("")
  const [menuId, setMenuId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    desc: "",
    members: new Set<MemberKey>(),
    budget: "",
    date: "2026-08-23",
    repeat: "None",
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

  const activeList = lists.find((l) => l.id === activeId) ?? lists[0]

  const filtered = activeList.items.filter((i) => catFilter === "all" || i.cat === catFilter)
  const todoItems = filtered.filter((i) => !i.done)
  const doneItems = filtered.filter((i) => i.done)

  const totals = useMemo(() => {
    const allItems = lists.flatMap((l) => l.items)
    const todo = allItems.filter((i) => !i.done)
    return {
      lists: lists.length,
      toBuy: todo.length,
      purchased: allItems.length - todo.length,
      planned: todo.reduce((s, i) => s + i.price, 0),
    }
  }, [lists])

  const est = activeList.items.reduce((s, i) => s + i.price, 0)
  const actual = activeList.items.filter((i) => i.done).reduce((s, i) => s + i.price, 0)
  const remainingBudget = Math.max(0, activeList.budget - est)
  const budgetPct = activeList.budget ? Math.min(100, Math.round((est / activeList.budget) * 100)) : 0
  const listPct = activeList.items.length
    ? Math.round((activeList.items.filter((i) => i.done).length / activeList.items.length) * 100)
    : 0

  function updateItem(id: number, patch: Partial<Item>) {
    setLists((prev) =>
      prev.map((l) =>
        l.id === activeId
          ? { ...l, items: l.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }
          : l,
      ),
    )
  }

  function removeItem(id: number) {
    const item = activeList.items.find((i) => i.id === id)
    setLists((prev) =>
      prev.map((l) =>
        l.id === activeId ? { ...l, items: l.items.filter((i) => i.id !== id) } : l,
      ),
    )
    setMenuId(null)
    toast.success(`Đã xóa "${item?.name ?? "món"}"`)
  }

  function duplicateItem(id: number) {
    const item = activeList.items.find((i) => i.id === id)
    if (!item) return
    const copy: Item = { ...item, id: Date.now(), done: false }
    setLists((prev) =>
      prev.map((l) => {
        if (l.id !== activeId) return l
        const idx = l.items.findIndex((i) => i.id === id)
        const items = [...l.items]
        items.splice(idx + 1, 0, copy)
        return { ...l, items }
      }),
    )
    setMenuId(null)
    toast.success(`Đã nhân bản "${item.name}"`)
  }

  function handleQuickAdd(e: React.FormEvent) {
    e.preventDefault()
    const name = quick.trim()
    if (!name) {
      toast.error("Vui lòng nhập tên món")
      return
    }
    const cat = guessCat(name)
    const item: Item = {
      id: Date.now(),
      name,
      emoji: CAT_META[cat].emoji,
      cat,
      qty: "1 pc",
      price: 0,
      member: "family",
      priority: "low",
      done: false,
    }
    setLists((prev) =>
      prev.map((l) => (l.id === activeId ? { ...l, items: [...l.items, item] } : l)),
    )
    setQuick("")
    toast.success(`Đã thêm "${name}" vào ${activeList.name}`)
  }

  function addSuggested() {
    const item: Item = {
      id: Date.now(),
      name: "Milk",
      emoji: "🥛",
      cat: "food",
      qty: "2 boxes",
      price: 80_000,
      member: "mom",
      priority: "medium",
      done: false,
    }
    setLists((prev) =>
      prev.map((l) => (l.id === activeId ? { ...l, items: [...l.items, item] } : l)),
    )
    toast.success('Đã thêm "Sữa" vào danh sách định kỳ của bạn')
  }

  function toggleMember(key: MemberKey) {
    setForm((f) => {
      const next = new Set(f.members)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return { ...f, members: next }
    })
  }

  function handleCreateList() {
    const name = form.name.trim()
    if (!name) {
      toast.error("Vui lòng nhập tên danh sách")
      return
    }
    const budget = parseInt(form.budget.replace(/[^\d]/g, ""), 10)
    if (Number.isNaN(budget) || budget < 0) {
      toast.error("Vui lòng nhập ngân sách hợp lệ")
      return
    }
    const newList: SList = {
      id: Date.now(),
      emoji: "🛍️",
      name,
      desc: form.desc.trim() || "Shared family shopping list",
      budget,
      date: form.date,
      repeat: form.repeat,
      items: [],
    }
    setLists((prev) => [...prev, newList])
    setActiveId(newList.id)
    setCatFilter("all")
    setModalOpen(false)
    setForm({ name: "", desc: "", members: new Set(), budget: "", date: "2026-08-23", repeat: "None" })
    toast.success(`Danh sách "${name}" đã được tạo`)
  }

  const renderItem = (item: Item, done: boolean) => {
    const mStyle = MEMBER_STYLE[item.member]
    const pStyle = PRIORITY_STYLE[item.priority]
    const memberLabel = MEMBERS.find((m) => m.key === item.member)?.label ?? "Family"
    return (
      <div key={item.id} className="relative flex items-center gap-3 py-3">
        <button
          aria-label={done ? `Đánh dấu ${item.name} là cần mua` : `Đánh dấu ${item.name} là đã mua`}
          onClick={() => updateItem(item.id, { done: !done })}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
            done
              ? "border-leaf-400 bg-leaf-400 text-night-900"
              : "border-cream-50/30 text-transparent hover:border-lamp-400",
          )}
        >
          <Check className="size-3" />
        </button>

        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl bg-night-700 text-lg transition-opacity",
            done && "opacity-50 grayscale",
          )}
        >
          {item.emoji}
        </span>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm font-medium text-cream-100",
              done && "text-bark-400 line-through",
            )}
          >
            {item.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-bark-500">
            {CAT_META[item.cat].label} · {item.qty}
          </p>
        </div>

        <span
          className={cn(
            "hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex",
            mStyle.chip,
          )}
        >
          {memberLabel}
        </span>

        <span
          className={cn(
            "hidden shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium md:inline-flex",
            pStyle.chip,
          )}
        >
          <span className={cn("size-1.5 rounded-full", pStyle.dot)} />
          {pStyle.label}
        </span>

        <span
          className={cn(
            "w-24 shrink-0 text-right text-sm font-semibold whitespace-nowrap",
            done ? "text-bark-400 line-through" : "text-cream-100",
          )}
        >
          {vnd(item.price)}
          <span className="ml-1 text-[10px] font-normal text-bark-500">VND</span>
        </span>

        <div>
          <button
            aria-label={`Options for ${item.name}`}
            onClick={() => setMenuId(menuId === item.id ? null : item.id)}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-bark-400 transition-colors hover:bg-cream-50/5 hover:text-cream-100",
              menuId === item.id && "bg-cream-50/5 text-cream-100",
            )}
          >
            <MoreHorizontal className="size-4" />
          </button>

          {menuId === item.id && (
            <>
              <button
                aria-label="Đóng menu"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setMenuId(null)}
              />
              <div className="absolute top-full right-0 z-50 mt-1 w-36 overflow-hidden rounded-lg border border-cream-50/15 bg-night-800 py-1 shadow-xl">
                <button
                  onClick={() => duplicateItem(item.id)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-cream-100 hover:bg-cream-50/5"
                >
                  <Copy className="size-3.5 text-bark-400" /> Duplicate
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-wine-300 hover:bg-cream-50/5"
                >
                  <Trash2 className="size-3.5" /> Remove
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  const stats = [
    { label: "Danh sách hoạt động", value: String(totals.lists), icon: ClipboardList, tint: "bg-purple-500/15 text-purple-300", note: "chia sẻ với gia đình" },
    { label: "Món cần mua", value: String(totals.toBuy), icon: ShoppingCart, tint: "bg-blue-500/15 text-blue-300", note: "trên tất cả danh sách" },
    { label: "Đã mua", value: String(totals.purchased), icon: CheckCheck, tint: "bg-teal-500/15 text-teal-300", note: "hoàn thành tuần này" },
    { label: "Ngân sách ước tính", value: vnd(totals.planned), icon: Wallet, tint: "bg-lamp-400/15 text-lamp-300", note: "chi dự kiến · VND" },
  ]

  return (
    <div ref={rootRef} className="mx-auto max-w-7xl space-y-6">
      <div className="fh-fade flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-cream-50">Mua sắm</h1>
          <p className="mt-1 text-sm text-bark-400">
            Lên kế hoạch và quản lý mọi nhu cầu của gia đình
          </p>
        </div>
        <Button
          onClick={() => {
            quickRef.current?.focus()
            quickRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
          }}
        >
          <Plus /> Thêm món
        </Button>
      </div>

      <div className="fh-fade grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Panel key={s.label} className="flex items-center gap-4">
            <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", s.tint)}>
              <s.icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-2xl leading-tight text-cream-50">{s.value}</p>
              <p className="mt-0.5 truncate text-xs text-bark-400">
                {s.label} · <span className="text-bark-500">{s.note}</span>
              </p>
            </div>
          </Panel>
        ))}
      </div>

      <div className="fh-fade">
        <SectionHeader
          icon={ShoppingBasket}
          title="Danh sách mua sắm"
          subtitle="Danh sách chung mọi người trong gia đình đều chỉnh sửa được"
        />
        <div className="flex gap-3 overflow-x-auto pb-1">
          {lists.map((l) => {
            const done = l.items.filter((i) => i.done).length
            const pct = l.items.length ? Math.round((done / l.items.length) * 100) : 0
            const isActive = l.id === activeId
            return (
              <button
                key={l.id}
                onClick={() => {
                  setActiveId(l.id)
                  setCatFilter("all")
                }}
                className={cn(
                  "w-52 shrink-0 rounded-xl border p-4 text-left transition-colors",
                  isActive
                    ? "border-lamp-400/40 bg-lamp-400/5"
                    : "border-cream-50/10 bg-night-800/50 hover:border-cream-50/20",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-night-700 text-lg">
                    {l.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-cream-100">{l.name}</p>
                    <p className="text-xs text-bark-500">
                      {l.items.length - done} cần mua · {l.items.length} món
                    </p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-night-700">
                  <div
                    className={cn("h-full rounded-full", isActive ? "bg-lamp-400" : "bg-bark-500")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {isActive && (
                  <p className="mt-2 text-[11px] font-medium text-lamp-300">{pct}% hoàn thành</p>
                )}
              </button>
            )
          })}
          <button
            onClick={() => setModalOpen(true)}
            className="flex w-52 shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-cream-50/20 p-4 text-bark-400 transition-colors hover:border-lamp-400/50 hover:text-lamp-300"
          >
            <span className="flex size-9 items-center justify-center rounded-full border border-current">
              <Plus className="size-4" />
            </span>
            <span className="text-sm font-medium">Tạo danh sách mới</span>
          </button>
        </div>
      </div>

      <section className="fh-fade rounded-xl border border-lamp-400/20 bg-night-800/60 p-4 backdrop-blur-sm sm:p-5">
        <form onSubmit={handleQuickAdd} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <ShoppingCart className="absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-bark-500" />
            <input
              ref={quickRef}
              type="text"
              value={quick}
              onChange={(e) => setQuick(e.target.value)}
              placeholder="Gia đình bạn cần gì?"
              className="w-full rounded-lg border border-cream-50/15 bg-night-900/70 py-3 pr-3 pl-11 text-sm text-cream-100 placeholder:text-bark-500 focus:ring-2 focus:ring-lamp-400/40 focus:outline-none"
            />
          </div>
          <Button type="submit" className="sm:w-auto">
            <Plus /> Thêm món
          </Button>
        </form>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel className="fh-fade lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-night-700 text-xl">
                {activeList.emoji}
              </span>
              <div>
                <h2 className="text-base font-semibold text-cream-50">{activeList.name}</h2>
                <p className="text-xs text-bark-500">
                  {activeList.desc} · Budget {vnd(activeList.budget)} VND
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-lamp-400/10 px-2.5 py-1 text-xs font-semibold text-lamp-300">
              {listPct}% completed
            </span>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const count =
                f.key === "all"
                  ? activeList.items.length
                  : activeList.items.filter((i) => i.cat === f.key).length
              const isActive = catFilter === f.key
              return (
                <button
                  key={f.key}
                  onClick={() => setCatFilter(f.key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    isActive
                      ? "border-lamp-400/30 bg-lamp-400/15 text-lamp-300"
                      : "border-cream-50/10 text-bark-400 hover:border-cream-50/25 hover:text-cream-100",
                  )}
                >
                  {f.label}
                  <span className={cn("text-[10px]", isActive ? "text-lamp-300/80" : "text-bark-500")}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <span className="text-3xl">🧺</span>
              <p className="text-sm font-medium text-cream-100">Nothing here yet</p>
              <p className="max-w-xs text-xs text-bark-500">
                Add items with the quick add bar above — everyone in the family will see them.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-1 pb-1">
                <p className="text-[11px] font-semibold tracking-widest text-bark-500 uppercase">
                  To Buy
                </p>
                <p className="text-[11px] text-bark-500">{todoItems.length} items</p>
              </div>
              <div className="divide-y divide-cream-50/5">
                {todoItems.length > 0 ? (
                  todoItems.map((i) => renderItem(i, false))
                ) : (
                  <p className="py-6 text-center text-sm text-bark-500">
                    🎉 Everything on this list is purchased!
                  </p>
                )}
              </div>

              {doneItems.length > 0 && (
                <>
                  <div className="mt-6 flex items-center justify-between border-t border-cream-50/10 px-1 pt-5 pb-1">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest text-bark-500 uppercase">
                      <CheckCheck className="size-3.5 text-leaf-300" /> Completed
                    </p>
                    <p className="text-[11px] text-bark-500">{doneItems.length} items</p>
                  </div>
                  <div className="divide-y divide-cream-50/5 opacity-75">
                    {doneItems.map((i) => renderItem(i, true))}
                  </div>
                </>
              )}
            </>
          )}
        </Panel>

        <div className="space-y-6">
          <div ref={budgetRef}>
            <Panel className="fh-fade">
<SectionHeader
            icon={Wallet}
            title="Ngân sách mua sắm"
            subtitle={activeList.name}
            action={
              <span className="flex items-center gap-1.5 rounded-full bg-lamp-400/10 px-2.5 py-1 text-xs font-semibold text-lamp-300">
                {budgetPct}% đã lên kế hoạch
              </span>
            }
          />
              <div className="flex items-end justify-between">
                <p className="font-display text-2xl text-cream-50">
                  {vnd(est)}{" "}
                  <span className="text-sm font-medium text-bark-400">
                    / {vnd(activeList.budget)} VND
                  </span>
                </p>
              </div>
              <div className="mt-3 h-3.5 w-full overflow-hidden rounded-full bg-night-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-lamp-500 to-lamp-300 transition-[width] duration-500"
                  style={{ width: `${budgetPct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-bark-400">
                <span className="font-semibold text-leaf-300">{vnd(remainingBudget)}</span> còn lại
                ngân sách danh sách
              </p>

              <dl className="mt-5 space-y-3 border-t border-cream-50/10 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <dt className="text-bark-400">Tổng ước tính</dt>
                  <dd className="font-semibold text-cream-100">{vnd(est)} VND</dd>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <dt className="text-bark-400">Tổng thực tế</dt>
                  <dd className="font-semibold text-leaf-300">{vnd(actual)} VND</dd>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <dt className="text-bark-400">Chênh lệch</dt>
                  <dd className="font-semibold text-leaf-300">
                    {activeList.budget - actual >= 0 ? "+" : ""}
                    {vnd(activeList.budget - actual)} VND
                  </dd>
                </div>
              </dl>
            </Panel>
          </div>

          <Panel className="fh-fade">
            <SectionHeader
              icon={Users}
              title="Hoạt động gia đình"
              subtitle="Cập nhật mới nhất từ mọi người"
            />
            <ul className="space-y-4">
              {ACTIVITY.map((a, idx) => {
                const style = MEMBER_STYLE[a.member]
                const member = MEMBERS.find((m) => m.key === a.member)!
                return (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex size-8 shrink-0 select-none items-center justify-center rounded-full text-[10px] font-bold",
                        style.avatar,
                      )}
                    >
                      {member.initial}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug">
                        <span className="font-medium text-cream-100">{member.label}</span>{" "}
                        <span className="text-bark-400">{a.verb}</span>{" "}
                        <span className="font-medium text-cream-100">“{a.item}”</span>
                      </p>
                      <p className="mt-0.5 text-xs text-bark-500">{a.time}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Panel>

          <section className="relative fh-fade overflow-hidden rounded-xl border border-lamp-400/20 bg-night-800/60 p-5 backdrop-blur-sm sm:p-6">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(244,189,92,0.06), transparent 55%)",
              }}
            />
            <div className="relative flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lamp-400/20 text-lamp-300">
                <Sparkles className="size-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-cream-50">Gợi ý mua sắm thông minh</h3>
                <p className="text-xs text-bark-500">Được tạo bởi Family AI</p>
              </div>
            </div>

            <div className="relative mt-5 space-y-3">
              <div className="flex items-start gap-2.5 rounded-lg border border-cream-50/10 bg-night-900/50 p-3">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-lamp-300" />
                <p className="text-sm leading-relaxed text-cream-100">
                  Bạn thường mua sữa mỗi tuần. Bạn có muốn thêm vào danh sách mua sắm định kỳ không?
                </p>
              </div>
              <div className="flex items-start gap-2.5 rounded-lg border border-cream-50/10 bg-night-900/50 p-3">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-lamp-300" />
                <p className="text-sm leading-relaxed text-cream-100">
                  Tổng chi tiêu mua sắm ước tính gần ngân sách thực phẩm tháng này.
                </p>
              </div>
            </div>

            <div className="relative mt-5 flex flex-col gap-2 sm:flex-row">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => budgetRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}>
                Xem ngân sách
              </Button>
              <Button size="sm" className="flex-1" onClick={addSuggested}>
                <Plus /> Thêm món gợi ý
              </Button>
            </div>

            <p className="relative mt-4 flex items-center gap-1.5 text-[11px] text-bark-500">
              <Info className="size-3.5 shrink-0" />
              Family AI đưa ra gợi ý — gia đình bạn quyết định.
            </p>
          </section>
        </div>
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
                <h3 className="text-lg font-semibold text-cream-50">Tạo danh sách mua sắm</h3>
                <p className="mt-0.5 text-xs text-bark-500">
                  Bắt đầu một danh sách chung gia đình có thể thêm món
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
                <label className={labelCls}>Tên danh sách</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Mua sắm hàng tuần"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Mô tả</label>
                <textarea
                  rows={2}
                  placeholder="Danh sách này dùng để làm gì?"
                  value={form.desc}
                  onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                  className={cn(inputCls, "resize-none")}
                />
              </div>

              <div>
                <label className={labelCls}>Thành viên được giao</label>
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Ngân sách</label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={form.budget}
                      onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                      className={cn(inputCls, "pr-12")}
                    />
                    <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-bark-500">
                      VND
                    </span>
                  </div>
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
                <label className={labelCls}>Lịch lặp lại</label>
                <select
                  value={form.repeat}
                  onChange={(e) => setForm((f) => ({ ...f, repeat: e.target.value }))}
                  className={inputCls}
                >
                  {REPEAT_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r === "Không lặp" ? "Không lặp lại" : `Lặp ${r.toLowerCase()}`}
                    </option>
                  ))}
                </select>
              </div>

              <Button className="w-full" onClick={handleCreateList}>
                <Plus /> Tạo danh sách
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
