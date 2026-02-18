import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  LayoutDashboard,
  Trello,
  CheckSquare,
  Calendar,
  Settings,
  Zap,
} from "lucide-react";
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

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", badge: null },
  { icon: Trello, label: "Trello", href: "/trello", badge: { color: "bg-amber-500", text: "3" } },
  { icon: CheckSquare, label: "Tarefas", href: "/tasks", badge: { color: "bg-cyan-500", text: "5" } },
  { icon: Calendar, label: "Calendário", href: "/calendar", badge: null },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 min-h-screen`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-slate-900 border-r border-white/[0.06] flex flex-col fixed left-0 top-0 bottom-0 z-40">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <span className="text-white font-bold text-sm">CC</span>
                </div>
                <span className="font-semibold text-slate-100">Control Center</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] active:bg-white/[0.08] transition-all duration-200 group relative overflow-hidden"
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="flex items-center gap-3 relative">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.03] group-hover:bg-violet-500/10 transition-colors duration-200">
                      <item.icon className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors duration-200" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>

                  {/* Status badge */}
                  {item.badge && (
                    <span className={`relative px-2 py-0.5 text-[10px] font-bold text-white rounded-full ${item.badge.color} shadow-lg`}>
                      {item.badge.text}
                    </span>
                  )}

                  {/* Active indicator */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-violet-500 group-hover:h-6 transition-all duration-200 rounded-r-full" />
                </a>
              ))}
            </nav>

            {/* Status indicator */}
            <div className="px-4 py-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
                </div>
                <span className="text-xs font-medium text-emerald-400">Sistema Online</span>
                <Zap className="w-3 h-3 text-emerald-400 ml-auto" />
              </div>
            </div>

            {/* Bottom section */}
            <div className="p-3 border-t border-white/[0.06]">
              <a
                href="/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] active:bg-white/[0.08] transition-all duration-200 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.03] group-hover:bg-violet-500/10 transition-colors duration-200"
                >
                  <Settings className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors duration-200" />
                </div>
                <span className="text-sm font-medium relative">Configurações</span>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-violet-500 group-hover:h-6 transition-all duration-200 rounded-r-full" />
              </a>
            </div>
          </aside>

          {/* Main content area */}
          <div className="flex-1 flex flex-col ml-64">
            {/* Header */}
            <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between px-8 sticky top-0 z-30">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-medium text-slate-400">Bem-vindo de volta</h2>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">Gilmar</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-violet-300">G</span>
                </div>
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
