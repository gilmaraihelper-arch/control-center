import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Control Center",
  description: "Centro de Controle local do Gilmar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}
      >
        <div className="min-h-screen flex bg-slate-950">
          {/* Sidebar */}
          <aside className="w-64 border-r border-slate-800 bg-slate-900/70 backdrop-blur flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-lg">
                C
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">Control Center</span>
                <span className="text-xs text-slate-400">Gilmar · local</span>
              </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-2 text-sm">
              <div className="px-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Hoje
              </div>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-slate-800 text-slate-50 text-sm font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Visão geral
              </button>

              <div className="px-2 pt-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Projetos
              </div>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200">
                <span className="h-1.5 w-1.5 rounded-sm bg-amber-400" />
                ChefExperience
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200">
                <span className="h-1.5 w-1.5 rounded-sm bg-sky-400" />
                Centro de Controle
              </button>

              <div className="px-2 pt-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Rotinas
              </div>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200">
                Inbox / Notícias
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200">
                Tarefas do dia
              </button>
            </nav>

            <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Liliana · online</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-h-screen bg-slate-950/95">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
