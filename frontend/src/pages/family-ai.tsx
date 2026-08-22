import { useRef, useState } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import {
  AlertCircle,
  ArrowRight,
  Bot,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  Mic,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
  Settings,
  Shield,
  ShoppingBag,
  Sparkles,
  Target,
  Trophy,
  Users,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP)

const QUICK_ACTIONS = [
  {
    icon: CalendarDays,
    title: "Phân tích lịch gia đình",
    desc: "Tìm xung đột và thời gian rảnh của gia đình",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Users,
    title: "Cân bằng việc nhà",
    desc: "Xem xét phân chia việc nhà",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: Wallet,
    title: "Xem lại chi tiêu gia đình",
    desc: "Hiểu rõ chi tiêu và ngân sách tháng này",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: ShoppingBag,
    title: "Xem lại danh sách mua sắm",
    desc: "Tổ chức món đồ và kiểm tra chi phí ước tính",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Target,
    title: "Kiểm tra mục tiêu gia đình",
    desc: "Theo dõi tiến độ mục tiêu chung",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
]

const INSIGHTS = [
  {
    icon: AlertCircle,
    title: "Xung đột lịch",
    desc: "2 sự kiện trùng nhau vào tối thứ Sáu.",
    button: "Xem lại lịch",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    iconBg: "bg-rose-500/20",
  },
  {
    icon: Users,
    title: "Cân bằng việc",
    desc: "Mẹ hiện có nhiều việc nhà được giao hơn các thành viên khác.",
    button: "Xem phân chia việc",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    iconBg: "bg-purple-500/20",
  },
  {
    icon: CreditCard,
    title: "Cảnh báo ngân sách",
    desc: "Chi tiêu thực phẩm đã đạt 75% ngân sách tháng.",
    button: "Xem tài chính",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    iconBg: "bg-amber-500/20",
  },
  {
    icon: Trophy,
    title: "Mục tiêu gia đình",
    desc: "Gia đình bạn còn 80 XP để đạt mục tiêu cuối tuần.",
    button: "Xem mục tiêu",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/20",
  },
]

const CHAT_MESSAGES = [
  {
    id: 1,
    role: "user",
    content: "Tìm thời gian tốt cho cả gia đình ăn tối cùng nhau tuần này.",
    time: "10:23 AM",
  },
  {
    id: 2,
    role: "assistant",
    content:
      'Tôi tìm thấy 2 khung giờ mà 4 thành viên đều rảnh:\n• Thứ 7, 7:00 PM - 9:00 PM\n• Chủ nhật, 6:30 PM - 8:30 PM\n\nBạn có muốn tôi tạo sự kiện ăn tối gia đình không?',
    time: "10:23 AM",
  },
]

const ACTIVITY_HISTORY = [
  {
    id: 1,
    title: "Đề xuất giờ ăn tối gia đình mới",
    desc: "Tìm thấy Thứ 7 7PM và Chủ nhật 6:30PM có sẵn",
    time: "2 phút trước",
    status: "completed",
  },
  {
    id: 2,
    title: "Tìm thấy 2 xung đột lịch",
    desc: "Phát hiện trùng lịch tối thứ Sáu",
    time: "15 phút trước",
    status: "completed",
  },
  {
    id: 3,
    title: "Đã xem chi tiêu tháng",
    desc: "Danh mục thực phẩm đạt 75% ngân sách",
    time: "1 giờ trước",
    status: "completed",
  },
  {
    id: 4,
    title: "Đề xuất phân chia việc cân bằng",
    desc: "Đề xuất phân lại 3 việc",
    time: "3 giờ trước",
    status: "pending",
  },
]

const SUGGESTED_QUESTIONS = [
  "Ai rảnh khi nào tuần này?",
  "Việc nào cần ưu tiên hôm nay?",
  "Chi tiêu tháng này thế nào?",
  "Danh mục nào gần hết ngân sách?",
  "Giúp chúng tôi lên kế hoạch hoạt động cuối tuần.",
]

export default function FamilyAI() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState(CHAT_MESSAGES)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        ".ai-fade",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" },
      )
    },
    { scope: rootRef },
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useGSAP(
    () => {
      scrollToBottom()
    },
    { scope: rootRef, dependencies: [messages] },
  )

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      role: "user" as const,
      content: inputValue.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: "assistant" as const,
        content: "I understand you're asking about family planning. Let me help you with that based on your family's schedule and preferences.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1200)
  }

  const handleSuggestedClick = (question: string) => {
    setInputValue(question)
    handleSend()
  }

  return (
    <div ref={rootRef} className="mx-auto max-w-7xl space-y-5">
      {/* Header Section */}
      <div className="ai-fade">
        <h1 className="font-display text-3xl text-cream-50">Family AI</h1>
        <p className="mt-1 text-sm text-bark-400">Trợ lý thông minh cho gia đình ngăn nắp hơn</p>
      </div>

      {/* Welcome Section + Quick Actions */}
      <div className="ai-fade grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Left Column - Welcome + Chat */}
        <div className="space-y-6 min-w-0">
          {/* AI Welcome Section */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
            <CardContent className="relative py-6 sm:py-8 px-6 sm:px-8">
              <div className="flex items-start gap-4">
                <div className={cn("flex shrink-0 size-14 items-center justify-center rounded-2xl", "bg-gradient-to-br from-blue-500 to-purple-600")}>
                  <Bot className="size-7 text-cream-50" />
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="font-display text-2xl text-cream-50">Hôm nay tôi có thể giúp gia đình bạn gì?</h2>
                  <p className="mt-2 text-sm leading-relaxed text-bark-400 max-w-2xl">
                    Tôi có thể giúp bạn hiểu lịch trình, tổ chức việc, xem lại chi tiêu, và tìm thấy thông tin hữu ích.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-widest text-cream-50 uppercase">Thao tác nhanh</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.title}
                  variant="outline"
                  size="lg"
                  className={cn(
                    "h-auto min-h-[110px] p-5 text-left justify-start gap-4 transition-all hover:shadow-lg hover:shadow-blue-500/10",
                    action.bg,
                    action.border,
                    "hover:border-lamp-400/30",
                  )}
                  onClick={() => handleSuggestedClick(action.title)}
                >
                  <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", action.bg, action.color)}>
                    <action.icon className="size-5.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-cream-100 leading-snug truncate">{action.title}</p>
                    <p className="mt-1 text-xs text-bark-400 leading-relaxed truncate">{action.desc}</p>
                  </div>
                  <ArrowRight className="size-4.5 text-bark-500 group-hover:text-lamp-300 transition-colors" />
                </Button>
              ))}
            </div>
          </div>

          {/* Smart Family Insights */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-widest text-cream-50 uppercase">Thông tin thông minh</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {INSIGHTS.map((insight) => (
                <Card key={insight.title} className={cn("border-l-4 transition-all hover:shadow-lg", insight.border)}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className={cn("flex shrink-0 size-10 items-center justify-center rounded-xl", insight.iconBg, insight.color)}>
                        <insight.icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-cream-100">{insight.title}</h4>
                        <p className="mt-1.5 text-sm text-bark-400 leading-relaxed">{insight.desc}</p>
                        <Button
                          key={insight.button}
                          variant="ghost"
                          size="sm"
                          className={cn("mt-3 h-auto px-3 text-xs font-medium", insight.color, "hover:bg-transparent")}
                          onClick={() => handleSuggestedClick(insight.button)}
                        >
                          {insight.button}
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Chat Workspace */}
          <Card className="flex flex-col h-[calc(100vh-30rem)] min-h-[420px] max-h-[600px]">
            <CardHeader className="pb-3 border-b border-cream-50/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                    <Sparkles className="size-5 text-cream-50" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Khung trò chuyện AI</CardTitle>
                    <p className="text-xs text-bark-500">Hội thoại với Family AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-bark-400 hover:text-cream-100">
                    <MoreHorizontal />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-bark-400 hover:text-cream-100">
                    <Settings />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-5 space-y-6"
                style={{ scrollBehavior: "smooth" }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3 animate-fade-in min-w-0",
                      msg.role === "user" ? "flex-row-reverse" : "",
                    )}
                  >
                    <div
                      className={cn(
                        "flex shrink-0 size-8 items-center justify-center rounded-full",
                        msg.role === "user"
                          ? "bg-lamp-400/20 text-lamp-300"
                          : "bg-gradient-to-br from-blue-500 to-purple-600 text-cream-50",
                      )}
                    >
                      {msg.role === "user" ? (
                        <span className="text-xs font-semibold">U</span>
                      ) : (
                        <Bot className="size-4" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-3 min-w-0",
                        msg.role === "user"
                          ? "bg-lamp-400/10 border border-lamp-400/20 rounded-tr-sm text-cream-100"
                          : "bg-night-700/50 border border-cream-50/10 rounded-tl-sm text-cream-100",
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                      <span className={cn("block mt-2 text-[10px] text-bark-500", msg.role === "user" ? "text-right" : "")}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 animate-pulse">
                    <div className="flex shrink-0 size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                      <Bot className="size-4 text-cream-50" />
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-3 bg-night-700/50 border border-cream-50/10 rounded-2xl rounded-tl-sm">
                      <Loader2 className="size-4 text-lamp-400 animate-spin" />
                      <span className="text-sm text-bark-400">Family AI is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="border-t border-cream-50/10 p-4 bg-night-900/50 backdrop-blur-sm">
                <form onSubmit={handleSend} className="flex items-end gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Paperclip className="size-4.5 text-bark-500" />
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Mic className="size-4.5 text-bark-500" />
                    </div>
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Hỏi Family AI bất cứ điều gì về lịch trình, việc, hoặc kế hoạch của gia đình..."
                      className="pl-10 pr-10 h-12 text-sm"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    className="h-12 shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:opacity-50"
                    disabled={!inputValue.trim() || isLoading}
                  >
                    <Send className="size-4.5" />
                  </Button>
                </form>
                <p className="mt-3 text-center text-[11px] text-bark-500">
                  Family AI chỉ sử dụng thông tin gia đình bạn chọn chia sẻ.{" "}
                  <Button variant="link" size="sm" className="p-0 h-auto text-lamp-300 hover:underline">
                    Quản lý quyền dữ liệu
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Suggested Questions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-widest text-cream-50 uppercase">Câu hỏi gợi ý</h3>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  className="h-auto px-3 py-2 text-xs border-cream-50/10 hover:border-lamp-400/40 hover:bg-lamp-400/5"
                  onClick={() => handleSuggestedClick(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Activity History + Privacy */}
        <div className="space-y-6 sticky top-24 lg:top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {/* AI Activity History */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                    <Clock className="size-4.5" />
                  </div>
                  <CardTitle className="text-base">Lịch sử hoạt động AI</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="text-bark-400 hover:text-cream-100">
                  <Search />
                </Button>
              </div>
              <p className="text-xs text-bark-500">Hành động và thông tin gần đây</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-cream-50/5">
                {ACTIVITY_HISTORY.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-cream-50/3 transition-colors">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex shrink-0 size-9 items-center justify-center rounded-lg",
                          activity.status === "completed" ? "bg-leaf-500/15 text-leaf-400" : "bg-lamp-400/15 text-lamp-400",
                        )}
                      >
                        {activity.status === "completed" ? (
                          <CheckCircle2 className="size-4.5" />
                        ) : (
                          <Loader2 className="size-4.5 animate-spin" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-cream-100">{activity.title}</p>
                        <p className="mt-0.5 text-xs text-bark-400">{activity.desc}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[10px] text-bark-500">{activity.time}</span>
                          <span
                            className={cn(
                              "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                              activity.status === "completed"
                                ? "bg-leaf-500/20 text-leaf-300"
                                : "bg-lamp-400/20 text-lamp-300",
                            )}
                          >
                            {activity.status === "completed" ? (
                              <>
                                <CheckCircle2 className="size-2.5" />
                                Hoàn thành
                              </>
                            ) : (
                              <>
                                <Clock className="size-2.5" />
                                Đang chờ
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Privacy Panel */}
          <Card className="border-lamp-400/20 bg-gradient-to-br from-lamp-400/5 via-transparent to-blue-500/5">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex shrink-0 size-9 items-center justify-center rounded-xl bg-lamp-400/20 text-lamp-400">
                  <Shield className="size-5" />
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="font-medium text-cream-100">Quyền riêng tư của bạn</p>
                  <p className="mt-1 text-sm text-bark-400 leading-relaxed">
                    Family AI chỉ sử dụng thông tin gia đình bạn chọn chia sẻ. Bạn có toàn quyền kiểm soát dữ liệu nào có thể truy cập.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-lamp-400/30 text-lamp-300 hover:bg-lamp-400/10"
                  >
                    Quản lý quyền dữ liệu
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Brain className="size-4.5" />
                </div>
                <CardTitle className="text-base">Family AI có thể làm gì</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: CalendarDays, text: "Phân tích lịch trình & tìm xung đột" },
                { icon: Users, text: "Cân bằng phân chia việc nhà" },
                { icon: Wallet, text: "Xem chi tiêu & cảnh báo ngân sách" },
                { icon: ShoppingBag, text: "Tổ chức danh sách mua sắm & ước tính" },
                { icon: Target, text: "Theo dõi mục tiêu gia đình & tiến độ" },
                { icon: Sparkles, text: "Đề xuất hoạt động & kế hoạch gia đình" },
              ].map((cap, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-bark-400 hover:text-cream-100 transition-colors p-2 rounded-lg hover:bg-cream-50/3">
                  <cap.icon className="size-4.5 shrink-0 text-lamp-400" />
                  <span>{cap.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}