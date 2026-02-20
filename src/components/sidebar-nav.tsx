"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Trello,
  CheckSquare,
  Calendar,
  Zap,
  FolderOpen,
  Shield,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge: { color: string; text: string } | null;
}

export function SidebarNav() {
  const [taskCount, setTaskCount] = useState(0);
  const [kanbanCount, setKanbanCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Fetch project tasks count (incomplete)
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        const allTasks = Object.values(data).flatMap((p: any) => p.tarefas || []);
        const incomplete = allTasks.filter((t: any) => t.status !== "done").length;
        setTaskCount(incomplete);
      })
      .catch(console.error);

    // Fetch kanban count
    fetch("/api/board")
      .then((res) => res.json())
      .then((data) => {
        const total = data.columns?.reduce((acc: number, col: any) => acc + col.tarefas.length, 0) || 0;
        setKanbanCount(total);
      })
      .catch(console.error);

    // Check online status
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        const online = data.filter((s: any) => s.status === "online").length;
        setIsOnline(online > 0);
      })
      .catch(() => setIsOnline(false));

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetch("/api/projects")
        .then((res) => res.json())
        .then((data) => {
          const allTasks = Object.values(data).flatMap((p: any) => p.tarefas || []);
          const incomplete = allTasks.filter((t: any) => t.status !== "done").length;
          setTaskCount(incomplete);
        });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/", badge: null },
    { 
      icon: Trello, 
      label: "Trello", 
      href: "/trello", 
      badge: kanbanCount > 0 ? { color: "bg-amber-500", text: kanbanCount.toString() } : null 
    },
    { 
      icon: CheckSquare, 
      label: "Tarefas", 
      href: "/tasks", 
      badge: taskCount > 0 ? { color: "bg-cyan-500", text: taskCount.toString() } : null 
    },
    { icon: Calendar, label: "Calendário", href: "/calendar", badge: null },
    { icon: FolderOpen, label: "Documents", href: "/documents", badge: null },
    { icon: Shield, label: "Aprovações", href: "/approvals", badge: null },
  ];

  return (
    <>
      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden"
            style={{ color: 'var(--text-muted)' }}
          >
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="flex items-center gap-3 relative">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg group-hover:bg-violet-500/10 transition-colors duration-200" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                <item.icon className="w-4 h-4 group-hover:text-violet-400 transition-colors duration-200" />
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
      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
          isOnline 
            ? "bg-[var(--success-muted)] border-[var(--success)]" 
            : "bg-[var(--error-muted)] border-[var(--error)]"
        }`}>
          <div className="relative">
            <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-[var(--success)]" : "bg-[var(--error)]"}`} />
            <div className={`absolute inset-0 w-2 h-2 rounded-full ${isOnline ? "bg-[var(--success)]" : "bg-[var(--error)]"} animate-ping opacity-50`} />
          </div>
          <span className={`text-xs font-medium ${isOnline ? "text-[var(--success)]" : "text-[var(--error)]"}`}>
            {isOnline ? "Sistema Online" : "Sistema Offline"}
          </span>
          <Zap className={`w-3 h-3 ml-auto ${isOnline ? "text-[var(--success)]" : "text-[var(--error)]"}`} />
        </div>
      </div>
    </>
  );
}
