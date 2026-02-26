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
  Settings,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge: number | null;
  color: string;
}

export function SidebarNav() {
  const [taskCount, setTaskCount] = useState(0);
  const [kanbanCount, setKanbanCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

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

    // Update time
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { 
        hour12: false, 
        hour: "2-digit", 
        minute: "2-digit" 
      }));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetch("/api/projects")
        .then((res) => res.json())
        .then((data) => {
          const allTasks = Object.values(data).flatMap((p: any) => p.tarefas || []);
          const incomplete = allTasks.filter((t: any) => t.status !== "done").length;
          setTaskCount(incomplete);
        });
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const navItems: NavItem[] = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      href: "/", 
      badge: null,
      color: "var(--lcars-orange)"
    },
    { 
      icon: Trello, 
      label: "Trello", 
      href: "/trello", 
      badge: kanbanCount > 0 ? kanbanCount : null,
      color: "var(--lcars-blue)"
    },
    { 
      icon: CheckSquare, 
      label: "Tarefas", 
      href: "/tasks", 
      badge: taskCount > 0 ? taskCount : null,
      color: "var(--lcars-green)"
    },
    { 
      icon: Calendar, 
      label: "Calendário", 
      href: "/calendar", 
      badge: null,
      color: "var(--lcars-red)"
    },
    { 
      icon: FolderOpen, 
      label: "Documents", 
      href: "/documents", 
      badge: null,
      color: "var(--lcars-orange)"
    },
    { 
      icon: Shield, 
      label: "Aprovações", 
      href: "/approvals", 
      badge: null,
      color: "var(--lcars-blue)"
    },
  ];

  return (
    <>
      {/* Time Display */}
      <div className="px-4 py-3">
        <div 
          className="rounded-xl p-3 text-center"
          style={{ 
            background: 'var(--lcars-blue)',
            borderRadius: '16px 0 0 16px'
          }}
        >
          <span className="text-black font-bold text-xl tracking-widest">
            {currentTime}
          </span>
          <div className="text-black/70 text-[10px] font-bold tracking-widest mt-1">
            STARDATE {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Decorative bar */}
      <div className="mx-4 mb-4">
        <div 
          className="h-3 rounded-full"
          style={{ background: 'var(--lcars-orange)' }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            className="lcars-nav-item flex items-center justify-between group"
            style={{ color: item.color }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
                style={{ 
                  background: `${item.color}20`,
                }}
              >
                <item.icon 
                  className="w-4 h-4" 
                  style={{ color: item.color }}
                />
              </div>
              <span className="text-sm font-bold tracking-wider">{item.label}</span>
            </div>

            {/* Badge */}
            {item.badge !== null && (
              <span 
                className="lcars-badge"
                style={{ background: item.color }}
              >
                {item.badge}
              </span>
            )}
          </a>
        ))}
      </nav>

      {/* Decorative elements */}
      <div className="px-4 py-4 space-y-2">
        <div 
          className="h-2 rounded-full"
          style={{ background: 'var(--lcars-blue)', width: '60%' }}
        ></div>
        <div 
          className="h-2 rounded-full"
          style={{ background: 'var(--lcars-orange)', width: '40%' }}
        ></div>
        <div 
          className="h-2 rounded-full"
          style={{ background: 'var(--lcars-green)', width: '80%' }}
        ></div>
      </div>

      {/* Status indicator */}
      <div className="px-4 py-3">
        <div 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${
            isOnline 
              ? "border-[var(--lcars-green)] bg-[var(--lcars-green)]/10" 
              : "border-[var(--lcars-red)] bg-[var(--lcars-red)]/10"
          }`}
          style={{ borderRadius: '16px 0 0 16px' }}
        >
          <div className="relative">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                background: isOnline ? 'var(--lcars-green)' : 'var(--lcars-red)',
                animation: 'lcars-pulse 2s ease-in-out infinite'
              }} 
            />
          </div>
          <div className="flex-1">
            <div 
              className="text-xs font-bold tracking-widest uppercase"
              style={{ 
                color: isOnline ? 'var(--lcars-green)' : 'var(--lcars-red)'
              }}
            >
              {isOnline ? "SYSTEM ONLINE" : "SYSTEM OFFLINE"}
            </div>
            <div className="text-[10px] text-gray-500 tracking-wider">
              {isOnline ? "All systems nominal" : "Connection lost"}
            </div>
          </div>
          <Zap 
            className="w-4 h-4"
            style={{ 
              color: isOnline ? 'var(--lcars-green)' : 'var(--lcars-red)'
            }}
          />
        </div>
      </div>

      {/* Settings Link */}
      <div className="px-4 py-2">
        <a
          href="/settings"
          className="lcars-nav-item flex items-center gap-3 group"
          style={{ color: 'var(--lcars-gray-light)' }}
        >
          <div 
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: 'rgba(102, 102, 102, 0.2)' }}
          >
            <Settings className="w-4 h-4" style={{ color: 'var(--lcars-gray-light)' }} />
          </div>
          <span className="text-sm font-bold tracking-wider">Configurações</span>
        </a>
      </div>
    </>
  );
}
