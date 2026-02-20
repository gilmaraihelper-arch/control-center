import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Settings } from "lucide-react";
import { SidebarNav } from "@/components/sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme) {
                  document.documentElement.setAttribute('data-theme', theme);
                }
              })();
            `,
          }}
        />
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside 
            className="w-64 border-r flex flex-col fixed left-0 top-0 bottom-0 z-40"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            {/* Logo */}
            <div 
              className="h-16 flex items-center px-6 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <span className="text-white font-bold text-sm">CC</span>
                </div>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Control Center</span>
              </div>
            </div>

            {/* Navigation - Dynamic */}
            <SidebarNav />

            {/* Bottom section */}
            <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <a
                href="/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden"
                style={{ color: 'var(--text-muted)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div 
                  className="flex items-center justify-center w-8 h-8 rounded-lg group-hover:bg-violet-500/10 transition-colors duration-200"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                >
                  <Settings className="w-4 h-4 group-hover:text-violet-400 transition-colors duration-200" style={{ color: 'var(--text-muted)' }} />
                </div>
                <span className="text-sm font-medium relative">Configurações</span>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-violet-500 group-hover:h-6 transition-all duration-200 rounded-r-full" />
              </a>
            </div>
          </aside>

          {/* Main content area */}
          <div className="flex-1 flex flex-col ml-64">
            {/* Header */}
            <header 
              className="h-16 backdrop-blur-md border-b flex items-center justify-between px-8 sticky top-0 z-30"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Bem-vindo de volta</h2>
              </div>
              
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Gilmar</span>
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
