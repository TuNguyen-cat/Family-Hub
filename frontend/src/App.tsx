import type { ReactNode } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/context/auth-context"
import AppLayout from "@/components/app-layout"
import Landing from "@/pages/landing"
import Login from "@/pages/login"
import Register from "@/pages/register"
import Dashboard from "@/pages/dashboard"
import Lich from "@/pages/lich"
import ViecNha from "@/pages/viec-nha"
import ChiTieu from "@/pages/chi-tieu"
import MuaSam from "@/pages/mua-sam"
import PhanThuong from "@/pages/phan-thuong"
import FamilyAI from "@/pages/family-ai"
import Messages from "@/pages/messages"
import Settings from "@/pages/settings"

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-8 animate-spin text-lamp-400" />
      </div>
    )
  }
  if (!user) return <Navigate to="/dang-nhap" replace />
  return <>{children}</>
}

function SkipIfAuthed({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/app" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/dang-nhap"
        element={
          <SkipIfAuthed>
            <Login />
          </SkipIfAuthed>
        }
      />
      <Route
        path="/dang-ky"
        element={
          <SkipIfAuthed>
            <Register />
          </SkipIfAuthed>
        }
      />
      <Route
        path="/app"
        element={
          <Protected>
            <AppLayout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="lich" element={<Lich />} />
        <Route path="viec-nha" element={<ViecNha />} />
        <Route path="chi-tieu" element={<ChiTieu />} />
        <Route path="mua-sam" element={<MuaSam />} />
        <Route path="phan-thuong" element={<PhanThuong />} />
        <Route path="family-ai" element={<FamilyAI />} />
        <Route path="tin-nhan" element={<Messages />} />
        <Route path="cai-dat" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}