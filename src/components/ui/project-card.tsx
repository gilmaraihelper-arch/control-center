import * as React from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  name: string;
  description: string;
  progress: number;
  status: "todo" | "doing" | "done";
  href?: string;
  tasksCompleted?: number;
  tasksTotal?: number;
  className?: string;
  style?: React.CSSProperties;
  color?: "orange" | "blue" | "green" | "red";
}

const colorMap = {
  orange: {
    primary: "var(--lcars-orange)",
    secondary: "var(--lcars-orange-dark)",
    bg: "rgba(255, 153, 0, 0.15)",
  },
  blue: {
    primary: "var(--lcars-blue)",
    secondary: "var(--lcars-blue-dark)",
    bg: "rgba(153, 153, 204, 0.15)",
  },
  green: {
    primary: "var(--lcars-green)",
    secondary: "#558855",
    bg: "rgba(102, 153, 102, 0.15)",
  },
  red: {
    primary: "var(--lcars-red)",
    secondary: "#aa0000",
    bg: "rgba(204, 0, 0, 0.15)",
  },
};

const statusConfig = {
  todo: {
    label: "PENDENTE",
    color: "var(--lcars-gray-light)",
  },
  doing: {
    label: "EM ANDAMENTO",
    color: "var(--lcars-orange)",
  },
  done: {
    label: "CONCLUÍDO",
    color: "var(--lcars-green)",
  },
};

export function ProjectCard({
  name,
  description,
  progress,
  status,
  href,
  tasksCompleted,
  tasksTotal,
  className,
  style,
  color = "orange",
}: ProjectCardProps) {
  const statusInfo = statusConfig[status];
  const cardColor = colorMap[color];

  return (
    <div
      style={{
        ...style,
        background: 'var(--surface)',
        border: `4px solid ${cardColor.primary}`,
        borderRadius: '20px 4px 20px 4px',
      }}
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "p-5",
        className
      )}
    >
      {/* LCARS header bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-6 flex items-center justify-between px-3"
        style={{ 
          background: cardColor.primary,
          borderRadius: '16px 0 16px 0',
        }}
      >
        <span className="text-black text-[10px] font-bold tracking-widest uppercase truncate">
          {name}
        </span>
        
        <span 
          className="text-black text-[10px] font-bold px-2 py-0.5 rounded"
          style={{ background: 'rgba(0,0,0,0.2)' }}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {/* Description */}
        <p 
          className="text-sm line-clamp-2 min-h-[40px]"
          style={{ color: 'var(--lcars-gray-light)' }}
        >
          {description}
        </p>

        {/* Progress bar - LCARS style */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span 
              className="font-bold tracking-wider uppercase"
              style={{ color: 'var(--lcars-gray-light)' }}
            >
              Progresso
            </span>
            <span 
              className="font-bold"
              style={{ color: cardColor.primary }}
            >
              {progress}%
            </span>
          </div>

          <div 
            className="relative h-3 w-full overflow-hidden rounded-full"
            style={{ background: 'var(--lcars-gray)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${cardColor.secondary}, ${cardColor.primary})`,
              }}
            />
            
            {/* LCARS decorative ticks */}
            <div className="absolute inset-0 flex justify-between px-2">
              <div className="w-px h-full bg-black/30"></div>
              <div className="w-px h-full bg-black/30"></div>
              <div className="w-px h-full bg-black/30"></div>
              <div className="w-px h-full bg-black/30"></div>
            </div>
          </div>
        </div>

        {/* Tasks count */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span 
              className="text-xs tracking-wider"
              style={{ color: 'var(--lcars-gray-light)' }}
            >
              TAREFAS:
            </span>
            <span 
              className="text-sm font-bold"
              style={{ color: cardColor.primary }}
            >
              {tasksCompleted || 0} / {tasksTotal || 0}
            </span>
          </div>

          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 hover:opacity-80"
              style={{ 
                background: cardColor.bg,
                color: cardColor.primary,
              }}
            >
              <ExternalLink className="h-3 w-3" />
              <span className="text-xs font-bold tracking-wider">ABRIR</span>
            </a>
          )}
        </div>
      </div>
      
      {/* Decorative corner element */}
      <div 
        className="absolute bottom-3 right-3 flex items-center gap-1"
      >
        <div 
          className="w-2 h-2 rounded-full"
          style={{ background: cardColor.primary, opacity: 0.5 }}
        ></div>
        <div 
          className="w-4 h-1 rounded-full"
          style={{ background: cardColor.primary, opacity: 0.3 }}
        ></div>
      </div>
    </div>
  );
}
