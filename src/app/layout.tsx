import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarNav } from "@/components/sidebar-nav";
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
  title: "CONTROL CENTER",
  description: "Centro de Controle LCARS - Starfleet Interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-black`}
      >
        <div className="flex min-h-screen">
          {/* Main content area - Left side */}
          <div className="flex-1 flex flex-col mr-72">
            {/* LCARS Header */}
            <header 
              className="h-20 flex items-center px-8 sticky top-0 z-30 lcars-header"
              style={{ backgroundColor: 'var(--lcars-black)' }}
            >
              {/* Title with LCARS styling */}
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold tracking-[0.2em] uppercase" 
                      style={{ color: 'var(--lcars-orange)' }}>
                    CONTROL
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1 rounded-full" style={{ background: 'var(--lcars-blue)' }}></div>
                    <span className="text-xs font-bold tracking-[0.3em] uppercase" 
                          style={{ color: 'var(--lcars-blue)' }}>
                      CENTER
                    </span>
                  </div>
                </div>
                
                {/* Decorative bar */}
                <div className="h-10 w-1 rounded-full ml-4" style={{ background: 'var(--lcars-orange)' }}></div>
                
                {/* Subtitle */}
                <div className="flex flex-col">
                  <span className="text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--lcars-gray-light)' }}>
                    Starfleet Command
                  </span>
                  <span className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--lcars-gray-light)' }}>
                    System Interface v4.2
                  </span>
                </div>
              </div>

              {/* Right side of header */}
              <div className="ml-auto flex items-center gap-4">
                {/* Status indicators */}
                <div className="flex items-center gap-3">
                  <div className="lcars-status lcars-status-online">
                    <span className="lcars-status-dot"></span>
                    ONLINE
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ background: 'var(--lcars-orange)' }}></div>
                  <div className="w-3 h-3 rounded-full" style={{ background: 'var(--lcars-blue)' }}></div>
                  <div className="w-3 h-3 rounded-full" style={{ background: 'var(--lcars-red)' }}></div>
                </div>
              </div>
            </header>

            {/* Decorative horizontal bar */}
            <div className="h-1 mx-8 rounded-full" style={{ background: 'var(--lcars-orange)' }}></div>

            {/* Page content */}
            <main className="flex-1 p-8 lcars-grid">
              {children}
            </main>
          </div>

          {/* LCARS Sidebar - Right side */}
          <aside 
            className="w-72 flex flex-col fixed right-0 top-0 bottom-0 z-40 lcars-sidebar"
            style={{ backgroundColor: 'var(--lcars-black)' }}
          >
            {/* Top decorative section */}
            <div className="lcars-sidebar-top flex items-end justify-end px-4 pb-2">
              <span className="text-black font-bold text-xs tracking-widest">LCARS-1847</span>
            </div>
            
            {/* Decorative gap */}
            <div className="h-4"></div>
            
            {/* Navigation */}
            <SidebarNav />
            
            {/* Decorative gap */}
            <div className="h-4"></div>
            
            {/* Bottom decorative section */}
            <div className="lcars-sidebar-bottom mt-auto flex items-start justify-between px-4 pt-2">
              <div className="flex flex-col gap-1">
                <div className="w-8 h-2 rounded-full bg-black/30"></div>
                <div className="w-6 h-2 rounded-full bg-black/30"></div>
              </div>
              <span className="text-black font-bold text-xs tracking-widest">NCC-1701-D</span>
            </div>
          </aside>
        </div>
      </body>
    </html>
  );
}
