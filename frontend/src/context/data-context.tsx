import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import {
  Briefcase,
  GraduationCap,
  Music,
  PartyPopper,
  ShoppingBag,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react"

export type MemberKey = "dad" | "mom" | "minh" | "an" | "family"

export type CalEvent = {
  id: number
  day: number
  title: string
  time: string
  member: MemberKey
  icon?: LucideIcon
}

export type Priority = "low" | "medium" | "high"
export type Category = "chores" | "shopping" | "cleaning" | "laundry" | "meal" | "errand"
export type Status = "todo" | "progress" | "review" | "done"

export type Task = {
  id: number
  title: string
  member: MemberKey
  due: string
  priority: Priority
  category: Category
  xp: number
}

export type BoardTask = Task & { status: Status }

const INITIAL_EVENTS: CalEvent[] = [
  { id: 1, day: 3, title: "Work meeting", time: "09:00", member: "dad", icon: Briefcase },
  { id: 2, day: 5, title: "Shopping", time: "16:00", member: "mom", icon: ShoppingBag },
  { id: 3, day: 11, title: "Math class", time: "17:30", member: "minh", icon: GraduationCap },
  { id: 4, day: 13, title: "Music class", time: "18:00", member: "an", icon: Music },
  { id: 5, day: 16, title: "Family dinner", time: "19:00", member: "family", icon: UtensilsCrossed },
  { id: 6, day: 22, title: "Birthday party", time: "18:30", member: "family", icon: PartyPopper },
  { id: 7, day: 24, title: "Work meeting", time: "10:00", member: "dad", icon: Briefcase },
  { id: 8, day: 27, title: "Shopping", time: "09:30", member: "mom", icon: ShoppingBag },
]

const INITIAL_TASKS: BoardTask[] = [
  { id: 1, title: "Take out the trash", member: "minh", due: "Today, 6:00 PM", priority: "low", category: "chores", xp: 5, status: "todo" },
  { id: 2, title: "Clean bedroom", member: "an", due: "Today, 7:30 PM", priority: "medium", category: "cleaning", xp: 10, status: "todo" },
  { id: 3, title: "Buy groceries", member: "mom", due: "Tue, Aug 18 · 5:00 PM", priority: "high", category: "shopping", xp: 10, status: "todo" },
  { id: 4, title: "Clean the kitchen", member: "mom", due: "Today, 8:00 PM", priority: "high", category: "cleaning", xp: 15, status: "progress" },
  { id: 5, title: "Organize living room", member: "dad", due: "Wed, Aug 19 · 7:00 PM", priority: "medium", category: "cleaning", xp: 10, status: "progress" },
  { id: 6, title: "Laundry", member: "an", due: "Thu, Aug 20 · 9:00 AM", priority: "low", category: "laundry", xp: 10, status: "review" },
  { id: 7, title: "Prepare dinner ingredients", member: "dad", due: "Today, 5:30 PM", priority: "medium", category: "meal", xp: 10, status: "review" },
  { id: 8, title: "Wash dishes", member: "minh", due: "Yesterday · done", priority: "low", category: "chores", xp: 5, status: "done" },
  { id: 9, title: "Water plants", member: "mom", due: "Sat, Aug 15 · done", priority: "low", category: "errand", xp: 5, status: "done" },
  { id: 10, title: "Clean the table", member: "an", due: "Sat, Aug 15 · done", priority: "medium", category: "cleaning", xp: 5, status: "done" },
]

const FALLBACK_MEMBER: Record<string, MemberKey> = {
  parent: "dad",
  child: "minh",
  other: "mom",
}

type DataContextValue = {
  events: CalEvent[]
  tasks: BoardTask[]
  completed: Set<number>
  addEvent: (event: Omit<CalEvent, "id">) => void
  addTask: (task: Omit<BoardTask, "id">) => void
  toggleTask: (id: number) => void
  memberKeyForUsername: (username?: string) => MemberKey
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalEvent[]>(INITIAL_EVENTS)
  const [tasks, setTasks] = useState<BoardTask[]>(INITIAL_TASKS)
  const [completed, setCompleted] = useState<Set<number>>(new Set())

  const addEvent = useCallback((event: Omit<CalEvent, "id">) => {
    setEvents((prev) => [...prev, { ...event, id: Math.max(0, ...prev.map((e) => e.id)) + 1 }])
  }, [])

  const addTask = useCallback((task: Omit<BoardTask, "id">) => {
    setTasks((prev) => [...prev, { ...task, id: Math.max(0, ...prev.map((t) => t.id)) + 1 }])
  }, [])

  const toggleTask = useCallback((id: number) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const memberKeyForUsername = useCallback((username?: string): MemberKey => {
    if (!username) return "family"
    const key = username.toLowerCase()
    if (key === "dad" || key === "mom" || key === "minh" || key === "an") return key
    return FALLBACK_MEMBER[key] ?? "minh"
  }, [])

  const value = useMemo(
    () => ({ events, tasks, completed, addEvent, addTask, toggleTask, memberKeyForUsername }),
    [events, tasks, completed, addEvent, addTask, toggleTask, memberKeyForUsername],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData phải được dùng bên trong DataProvider")
  return ctx
}