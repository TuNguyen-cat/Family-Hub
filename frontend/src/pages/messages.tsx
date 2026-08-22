import { useRef, useState } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCheck,
  FileText,
  Home,
  Image,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Pin,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP)

type Sender = "dad" | "mom" | "minh" | "an"

interface Message {
  id: number
  sender: Sender
  content: string
  time: string
  isOwn?: boolean
}

interface Conversation {
  id: string
  name: string
  avatar: string
  isGroup: boolean
  members?: string[]
  lastMessage: string
  time: string
  unread?: number
  icon?: LucideIcon
}

const SENDERS: Record<Sender, { name: string; avatar: string; color: string; emoji: string }> = {
  dad: { name: "Bố", avatar: "👨", color: "text-blue-400", emoji: "👨" },
  mom: { name: "Mẹ", avatar: "👩", color: "text-pink-400", emoji: "👩" },
  minh: { name: "Minh", avatar: "👦", color: "text-teal-400", emoji: "👦" },
  an: { name: "An", avatar: "👧", color: "text-rose-400", emoji: "👧" },
}

const CONVERSATIONS: Conversation[] = [
  {
    id: "family",
    name: "Nguyen Family",
    avatar: "👨‍👩‍👧‍👦",
    isGroup: true,
    members: ["Bố", "Mẹ", "Minh", "An"],
    lastMessage: "An: Me too!",
    time: "10:23",
    unread: 3,
    icon: Users,
  },
  {
    id: "dad",
    name: "Bố",
    avatar: "👨",
    isGroup: false,
    lastMessage: "Đi chợ về nhé",
    time: "08:15",
    unread: 0,
    icon: Home,
  },
  {
    id: "mom",
    name: "Mẹ",
    avatar: "👩",
    isGroup: false,
    lastMessage: "Minh ơi, nhớ đổ rác nha",
    time: "Hôm qua",
    unread: 2,
    icon: Home,
  },
  {
    id: "minh",
    name: "Minh",
    avatar: "👦",
    isGroup: false,
    lastMessage: "Xong bài tập rồi!",
    time: "Thứ 5",
    unread: 0,
    icon: Home,
  },
  {
    id: "an",
    name: "An",
    avatar: "👧",
    isGroup: false,
    lastMessage: "Mẹ ơi cho con ăn kem 🍦",
    time: "Thứ 4",
    unread: 1,
    icon: Home,
  },
]

const MESSAGES: Message[] = [
  { id: 1, sender: "mom", content: "Who will be home for dinner tonight?", time: "09:15" },
  { id: 2, sender: "minh", content: "I'll be home around 6:30 PM.", time: "09:17" },
  { id: 3, sender: "dad", content: "I'll arrive around 7:00 PM.", time: "09:18" },
  { id: 4, sender: "an", content: "Me too!", time: "09:19" },
]

const PINNED_MESSAGES = [
  { id: 1, content: "Family dinner every Sunday at 7:00 PM", author: "Mẹ", time: "3 days ago" },
]

const SHARED_ACTIVITY = [
  { id: 1, icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10", text: "Mẹ created a new shopping list", time: "2 hours ago" },
  { id: 2, icon: CheckCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", text: "Bố completed a household task", time: "5 hours ago" },
  { id: 3, icon: Sparkles, color: "text-blue-400", bg: "bg-blue-500/10", text: "Family AI suggested a free time", time: "Yesterday" },
]

const QUICK_SHARE = [
  { icon: CalendarDays, label: "Share Calendar Event", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { icon: Trash2, label: "Share Task", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { icon: FileText, label: "Share Shopping List", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { icon: Home, label: "Share Family Goal", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
]

const SHARED_CARDS = [
  {
    type: "event",
    icon: CalendarDays,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    title: "Family Dinner",
    subtitle: "Today, 7:00 PM",
    desc: "4 family members invited",
    buttonLabel: "View Event",
    buttonColor: "bg-blue-500 hover:bg-blue-400",
  },
  {
    type: "task",
    icon: Trash2,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    title: "Take Out the Trash",
    subtitle: "Assigned to Minh",
    desc: "Due today at 6:00 PM",
    buttonLabel: "View Task",
    buttonColor: "bg-purple-500 hover:bg-purple-400",
  },
]

export default function Messages() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [activeConversation, setActiveConversation] = useState<string>("family")
  const [searchQuery, setSearchQuery] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>(MESSAGES)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        ".msg-fade",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" },
      )
    },
    { scope: rootRef },
  )

  const filteredConversations = CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const currentConv = CONVERSATIONS.find((c) => c.id === activeConversation)

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const newMessage: Message = {
      id: Date.now(),
      sender: "dad",
      content: inputValue.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")
    setIsLoading(true)

    setTimeout(() => {
      const replies = [
        "Got it! Thanks for letting us know.",
        "Sounds good 👍",
        "Perfect, see you then!",
        "Noted, thank you!",
      ]
      const reply: Message = {
        id: Date.now() + 1,
        sender: "mom",
        content: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, reply])
      setIsLoading(false)
    }, 800)
  }

  const formatSender = (sender: Sender) => SENDERS[sender]

  return (
    <div ref={rootRef} className="h-full flex min-h-0">
      {/* LEFT COLUMN - Conversation List */}
      <aside className="w-80 shrink-0 border-r border-cream-50/10 bg-night-900 flex flex-col hidden lg:flex">
        <div className="p-4 border-b border-cream-50/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-cream-50">Messages</h2>
            <Button variant="ghost" size="icon" className="text-bark-400 hover:text-cream-100">
              <Plus className="size-4.5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-bark-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-9 h-10 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-cream-50/5">
            {filteredConversations.map((conv) => (
              <li key={conv.id}>
                <button
                  onClick={() => setActiveConversation(conv.id)}
                  className={cn(
                    "w-full p-3 text-left transition-colors hover:bg-cream-50/3",
                    activeConversation === conv.id
                      ? "bg-lamp-400/5 border-l-2 border-lamp-400"
                      : "",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("flex shrink-0 size-12 items-center justify-center rounded-xl text-xl", activeConversation === conv.id ? "bg-lamp-400/10" : "bg-night-700")}>
                      {conv.isGroup ? (
                        <span className="text-base">{conv.avatar}</span>
                      ) : (
                        <span className="text-base">{conv.avatar}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={cn("font-medium text-cream-100 truncate", activeConversation === conv.id ? "text-lamp-300" : "")}>
                          {conv.name}
                        </h4>
                        <span className={cn("text-[10px] text-bark-500 shrink-0", activeConversation === conv.id ? "text-lamp-400" : "")}>
                          {conv.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className={cn("text-sm truncate", activeConversation === conv.id ? "text-bark-400" : "text-bark-500")}>
                          {conv.lastMessage}
                        </p>
                        {conv.unread && conv.unread > 0 && (
                          <span className="ml-2 flex size-5 shrink-0 items-center justify-center rounded-full bg-lamp-400 text-[10px] font-semibold text-night-900">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-cream-50/10">
          <p className="text-xs text-bark-500 text-center">End-to-end encrypted</p>
        </div>
      </aside>

      {/* CENTER COLUMN - Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between gap-4 p-4 border-b border-cream-50/10 bg-night-900/50 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-cream-50 text-xl">
                {currentConv?.isGroup ? "👨‍👩‍👧‍👦" : currentConv?.avatar}
              </div>
              {currentConv?.isGroup && (
                <span className="absolute bottom-0 right-0 size-3.5 rounded-full bg-leaf-400 border-2 border-night-900" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-cream-100 truncate">{currentConv?.name}</h3>
              <p className="text-xs text-bark-400">
                {currentConv?.isGroup ? `${currentConv.members?.length} members` : "Direct message"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="text-bark-400 hover:text-cream-100">
              <Video />
            </Button>
            <Button variant="ghost" size="icon" className="text-bark-400 hover:text-cream-100">
              <MoreHorizontal />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[radial-gradient(ellipse_at_center,_rgba(234,168,58,0.03)_0%,_transparent_70%)]">
          <div className="flex items-center justify-center text-xs text-bark-500 py-4">
            <span className="px-3 py-1 rounded-full bg-night-700/50">Today</span>
          </div>

          {messages.map((msg) => {
            const senderInfo = formatSender(msg.sender)
            const isOwn = msg.isOwn || msg.sender === "dad"

            return (
              <div
                key={msg.id}
                className={cn("flex gap-3 animate-fade-in", isOwn ? "flex-row-reverse" : "")}
              >
                {!isOwn && (
                  <div className="flex shrink-0 size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-cream-50">
                    <span className="text-[10px] font-semibold">{senderInfo.name[0]}</span>
                  </div>
                )}
                <div className={cn("max-w-[70%] flex flex-col min-w-0", isOwn ? "items-end" : "items-start")}>
                  {!isOwn && (
                    <span className={cn("text-xs font-medium mb-1 px-1", senderInfo.color)}>
                      {senderInfo.name}
                    </span>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3",
                      isOwn
                        ? "bg-lamp-400/15 border border-lamp-400/20 rounded-br-sm text-cream-100"
                        : "bg-night-700/50 border border-cream-50/10 rounded-bl-sm text-cream-100",
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                  <span className={cn("mt-1.5 text-[10px] text-bark-500 flex items-center gap-1", isOwn ? "flex-row-reverse" : "")}>
                    {isOwn && <CheckCheck className="size-3 text-lamp-400" />}
                    {msg.time}
                  </span>
                </div>
              </div>
            )
          })}

          {/* Shared Cards */}
          <div className="space-y-3 pt-2">
            {SHARED_CARDS.map((card, idx) => (
              <div key={idx} className="msg-fade rounded-xl border border-cream-50/10 bg-night-800/50 p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className={cn("flex shrink-0 size-10 items-center justify-center rounded-lg", card.iconBg, card.iconColor)}>
                    <card.icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="font-medium text-cream-100 truncate">{card.title}</h5>
                      <span className="text-xs text-bark-500 shrink-0">{card.subtitle}</span>
                    </div>
                    <p className="mt-1 text-sm text-bark-400 truncate">{card.desc}</p>
                    <Button
                      variant="default"
                      size="sm"
                      className={cn("mt-3", card.buttonColor)}
                    >
                      {card.buttonLabel}
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isLoading && (
            <div className="flex justify-center gap-1.5 py-4 animate-pulse">
              <Bot className="size-4 text-lamp-400" />
              <span className="text-sm text-bark-400">Family AI is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Composer */}
        <div className="border-t border-cream-50/10 p-4 bg-night-900/50 backdrop-blur">
          <form onSubmit={handleSend} className="flex items-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-bark-400 hover:text-cream-100 h-10"
            >
              <Paperclip className="size-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-bark-400 hover:text-cream-100 h-10"
            >
              <Image className="size-5" />
            </Button>
            <div className="relative flex-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Write a message..."
                className="pr-12 h-10 text-sm"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-bark-400 hover:text-cream-100 h-8 w-8"
                >
                  <Sparkles className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-bark-400 hover:text-cream-100 h-8 w-8"
                >
                  <MessageSquare className="size-4" />
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              size="icon"
              className="h-10 shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:opacity-50"
              disabled={!inputValue.trim() || isLoading}
            >
              <Send className="size-4.5" />
            </Button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN - Info Panel */}
      <aside className="w-72 shrink-0 border-l border-cream-50/10 bg-night-900/50 flex flex-col hidden xl:flex">
        <div className="p-4 border-b border-cream-50/10 sticky top-0 bg-night-900/80 backdrop-blur z-10">
          <h3 className="font-display text-base text-cream-50">Family Group</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Members */}
          <section className="space-y-3">
            <h4 className="text-sm font-semibold tracking-widest text-cream-50 uppercase">Members</h4>
            <div className="flex flex-wrap gap-2">
              {["dad", "mom", "minh", "an"].map((key) => {
                const info = SENDERS[key as Sender]
                return (
                  <button
                    key={key}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-night-700/50 hover:bg-cream-50/5 transition-colors"
                  >
                    <span className="text-base">{info.emoji}</span>
                    <span className="text-sm text-cream-100">{info.name}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Pinned Messages */}
          <section className="space-y-3 pt-2 border-t border-cream-50/10">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold tracking-widest text-cream-50 uppercase flex items-center gap-1.5">
                <Pin className="size-3.5 text-lamp-400" />
                Pinned
              </h4>
            </div>
            <div className="space-y-2">
              {PINNED_MESSAGES.map((pin) => (
                <div key={pin.id} className="p-3 rounded-lg bg-night-700/50 border border-cream-50/5">
                  <p className="text-sm text-cream-100 leading-relaxed truncate">{pin.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-bark-500">{pin.author} · {pin.time}</span>
                    <Button variant="ghost" size="icon" className="text-bark-400 hover:text-cream-100 h-7 w-7">
                      <MoreHorizontal className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Shared Activity */}
          <section className="space-y-3 pt-2 border-t border-cream-50/10">
            <h4 className="text-sm font-semibold tracking-widest text-cream-50 uppercase">Shared Activity</h4>
            <div className="space-y-2">
              {SHARED_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-night-700/50 hover:bg-cream-50/3 transition-colors">
                  <div className={cn("flex shrink-0 size-8 items-center justify-center rounded-lg", activity.bg, activity.color)}>
                    <activity.icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-cream-100 truncate">{activity.text}</p>
                    <span className="text-[10px] text-bark-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Share */}
          <section className="space-y-3 pt-2 border-t border-cream-50/10">
            <h4 className="text-sm font-semibold tracking-widest text-cream-50 uppercase">Quick Share</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {QUICK_SHARE.map((item, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className={cn(
                    "h-auto p-3 text-left justify-start gap-3 transition-all hover:shadow-lg",
                    item.bg,
                    item.border,
                    "hover:border-lamp-400/30",
                  )}
                >
                  <div className={cn("flex shrink-0 size-9 items-center justify-center rounded-lg", item.bg, item.color)}>
                    <item.icon className="size-4.5" />
                  </div>
                  <span className="text-sm font-medium text-cream-100 truncate">{item.label}</span>
                </Button>
              ))}
            </div>
          </section>

          {/* Smart Message Assistance */}
          <section className="space-y-3 pt-2 border-t border-cream-50/10">
            <div className="flex items-center gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Bot className="size-4 text-cream-50" />
              </div>
              <h4 className="text-sm font-semibold text-cream-50">Smart Message Assistance</h4>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/10">
              <p className="text-sm text-bark-400">Summarize today's family messages</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full border-lamp-400/30 text-lamp-300 hover:bg-lamp-400/10"
              >
                Summarize
                <Sparkles className="size-3.5 ml-1" />
              </Button>
            </div>

            {/* AI Summary Preview */}
            <div className="p-3 rounded-lg bg-night-700/50 border border-cream-50/5 text-sm space-y-1.5">
              <p className="font-medium text-cream-100">AI Summary Preview:</p>
              <p className="text-bark-400 leading-relaxed break-words">"Today's key updates:</p>
              <p className="text-bark-400 leading-relaxed break-words">• Family dinner confirmed for 7:00 PM</p>
              <p className="text-bark-400 leading-relaxed break-words">• Minh will take out the trash</p>
              <p className="text-bark-400 leading-relaxed break-words">• Mom added milk and vegetables to the shopping list"</p>
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}