import { lazy, Suspense, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Link } from "react-router-dom"
import { ArrowRight, CalendarCheck, Check, Loader2, Sparkles, Users } from "lucide-react"

import { Button } from "@/components/ui/button"

const HearthScene = lazy(() => import("@/components/hearth-scene"))

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="2" y="2" width="44" height="44" rx="14" stroke="#d9cdb6" strokeWidth="2" opacity="0.55" />
      <path
        d="M24 37 10.5 24.5C7.8 21.9 7.8 17.6 10.5 15c2.8-2.7 7.2-2.7 10 .1L24 18.5l3.5-3.4c2.8-2.8 7.2-2.8 10-.1 2.7 2.7 2.7 7 0 9.6L24 37Z"
        fill="#F4BD5C"
      />
      <circle cx="37" cy="12" r="3.4" fill="#7DA689" />
    </svg>
  )
}

const PROBLEMS = [
  {
    title: "Phân việc nhà rõ ràng",
    problem: "“Ai đổ rác hôm nay?” cứ lặp lại mỗi ngày, kèm theo một cuộc tranh cãi.",
    fix: "Như một vòng tròn điều độ công bằng ai làm gì, ai còn nợ gì — không ai mặc kệ, không ai phải nhắc.",
    color: "text-lamp-300",
    icon: Check,
  },
  {
    title: "Đi chơi không phải nhọc nhằn",
    problem: "Người muốn đi, kẻ muốn ở. Lịch trình ai cũng hỏi lại ba lần.",
    fix: "Một nơi dành cho kế hoạch đi đâu, khi nào, ai đồng ý — cả nhà chốt cùng nhau, ai cũng theo trong vòng.",
    color: "text-leaf-300",
    icon: CalendarCheck,
  },
]

export default function Landing() {
  const mainRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.fromTo(".nav-item", { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 })
        .fromTo(
          ".hero-line",
          { y: 46, opacity: 0, rotate: 0.001 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.14 },
          "-=0.3",
        )
        .fromTo(
          ".hero-scene",
          { opacity: 0, scale: 0.86 },
          { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" },
          "-=0.5",
        )
        .fromTo(
          ".hero-cta",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
          "-=0.8",
        )
        .fromTo(
          ".hero-note",
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          "-=0.3",
        )

      const cards = gsap.utils.toArray<HTMLElement>(".problem-card")
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: i * 0.12,
            scrollTrigger: { trigger: card, start: "top 85%" },
          },
        )
      })

      gsap.fromTo(
        ".cta-band",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          scrollTrigger: { trigger: ".cta-band", start: "top 90%" },
        },
      )

      gsap.to(".hero-scene", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
    },
    { scope: mainRef },
  )

  return (
    <main ref={mainRef} className="relative">
      <section ref={heroRef} className="relative flex min-h-svh flex-col overflow-hidden">
        <nav className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <div className="nav-item flex items-center gap-3">
            <Logo />
            <span className="font-display text-lg text-cream-50">
              Family<span className="italic text-lamp-300">Hub</span>
            </span>
          </div>
          <div className="nav-item flex items-center gap-2 sm:gap-3">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/dang-nhap">Đăng nhập</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/dang-ky">
                Đăng ký <ArrowRight />
              </Link>
            </Button>
          </div>
        </nav>

        <div className="hero-scene pointer-events-none absolute inset-0 z-0" aria-hidden>
          <Suspense fallback={null}>
            <HearthScene />
          </Suspense>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 pb-24 pt-14 text-center">
          <p className="hero-line mb-6 flex items-center gap-2 rounded-full border border-cream-50/15 bg-night-800/60 px-4 py-1.5 text-xs tracking-wide text-bark-400 backdrop-blur">
            <Sparkles className="size-3.5 text-lamp-300" />
            Dành cho nhà nhỏ… và cả nhà lớn
          </p>
          <h1 className="hero-line text-balance font-display text-4xl leading-tight text-cream-50 sm:text-6xl md:text-7xl">
            Mọi chuyện trong nhà… <br />
            <span className="text-glow italic text-lamp-300">một màn hình.</span>
          </h1>
          <p className="hero-line mt-6 max-w-xl text-balance text-base leading-relaxed text-bark-400 sm:text-lg">
            Phân việc nhà không tranh cãi, kế hoạch đi chơi không hô hoán. Family Hub
            gắn kết cả nhà — ai làm gì, ai đi đâu, ai nhắc nhở — tất cả rõ như lòng bàn tay.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/dang-ky">
                Tạo nhà cho gia đình <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/dang-nhap">Có tài khoản? Đăng nhập</Link>
            </Button>
          </div>
          <div className="hero-note mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-bark-400">
            <span className="flex items-center gap-2">
              <Users className="size-4 text-leaf-300" /> Cả nhà chung một không gian
            </span>
            <span className="flex items-center gap-2">
              <Check className="size-4 text-leaf-300" /> Không cần tin nhắn nhóm nữa
            </span>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-6 py-24">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 flex items-center gap-2 text-sm font-medium tracking-widest text-lamp-300 uppercase">
            <span className="h-px w-8 bg-lamp-400" /> Không còn căng thẳng
          </p>
          <h2 className="text-balance font-display text-3xl text-cream-50 sm:text-4xl">
            Những “câu hỏi khó xử” thường ngày của gia đình
          </h2>
          <p className="mt-4 text-bark-400">
            Ai cũng từng nghe qua. Family Hub biến chúng thành vài cái nhấp chuột,
            thay bằng một cuộc thống nhất nhẹ nhàng.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {PROBLEMS.map((item) => (
            <div
              key={item.title}
              className="problem-card group rounded-xl border border-cream-50/10 bg-night-800/60 p-8 backdrop-blur transition-colors hover:border-lamp-400/40"
            >
              <div className="mb-5 flex size-12 items-center justify-center rounded-lg bg-night-700">
                <item.icon className={`size-6 ${item.color}`} />
              </div>
              <h3 className="font-display text-xl text-cream-50">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-bark-500 italic">
                {item.problem}
              </p>
              <div className="my-4 h-px w-full bg-cream-50/10" />
              <p className="flex gap-3 text-sm leading-relaxed text-cream-300">
                <ArrowRight className="mt-0.5 size-4 shrink-0 text-lamp-300" />
                {item.fix}
              </p>
            </div>
          ))}
        </div>

        <div className="cta-band relative mt-20 overflow-hidden rounded-xl border border-cream-50/10 bg-night-800/80 p-10 text-center sm:p-14">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(244,189,92,0.5), transparent)",
            }}
          />
          <h2 className="text-balance font-display text-3xl text-cream-50 sm:text-4xl">
            Bắt đầu từ một ngôi nhà ấm áp <span className="italic text-lamp-300">tối nay</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-bark-400">
            Tạo tài khoản, mời người thân — và để Family Hub lo những phần nhàm chán.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/dang-ky">
                <Loader2 className="hidden" /> Đăng ký miễn phí <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/dang-nhap">Đăng nhập</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-cream-50/5 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-bark-500 sm:flex-row">
          <span className="flex items-center gap-3">
            <Logo size={26} /> Family Hub — ấm áp hơn, tổ chức hơn.
          </span>
          <span>© {new Date().getFullYear()} Family Hub</span>
        </div>
      </footer>
    </main>
  )
}