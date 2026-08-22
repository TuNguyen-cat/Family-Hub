import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sonner"

import "./index.css"
import App from "./App"
import { AuthProvider } from "@/context/auth-context"
import { DataProvider } from "@/context/data-context"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <App />
          <Toaster
          position="top-center"
          theme="dark"
          toastOptions={{
            style: {
              background: "#1a2126",
              border: "1px solid rgba(247,242,231,0.12)",
              color: "#f7f2e7",
            },
          }}
        />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)