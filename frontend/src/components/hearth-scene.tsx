import { useMemo } from "react"

const COLORS = ["#f4bd5c", "#9fbea8", "#d9cdb6"]

type Spark = {
  left: number
  top: number
  size: number
  color: string
  delay: number
  duration: number
  drift: number
}

export default function HearthScene() {
  const sparks = useMemo<Spark[]>(
    () =>
      Array.from({ length: 36 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 6,
        drift: Math.random() > 0.5 ? 1 : -1,
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="spark-glow absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(244,189,92,0.14) 0%, rgba(159,190,168,0.06) 45%, transparent 70%)",
        }}
      />
      {sparks.map((s, i) => (
        <span
          key={i}
          className="spark-dust absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            opacity: 0,
            ["--drift" as string]: `${s.drift * 30}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  )
}