import * as React from "react";
import { MoreHorizontal, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

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
}

const statusConfig = {
  todo: {
    label: "Pendente",
    variant: "outline" as const,
    color: "text-slate-400",
    progressColor: "bg-slate-500",
  },
  doing: {
    label: "Em Andamento",
    variant: "default" as const,
    color: "text-amber-400",
    progressColor: "bg-amber-500",
  },
  done: {
    label: "Concluído",
    variant: "secondary" as const,
    color: "text-emerald-400",
    progressColor: "bg-emerald-500",
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
}: ProjectCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <div
      style={style}
      className={cn(
        "group relative overflow-hidden rounded-xl border p-5 backdrop-blur-sm transition-all duration-300",
        "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-hover)]",
        className
      )}
    >
      {/* Top row: Status badge + Actions */}
      <div className="mb-4 flex items-start justify-between">
        <Badge
          variant={statusInfo.variant}
          className={cn(
            "border-0 text-xs font-medium",
            status === "todo" && "bg-slate-500/10 text-slate-400",
            status === "doing" && "bg-amber-500/15 text-amber-400",
            status === "done" && "bg-emerald-500/15 text-emerald-400"
          )}
        >
          {statusInfo.label}
        </Badge>

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {href && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              style={{ color: 'var(--text-muted)' }}
              asChild
            >
              <a href={href} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            style={{ color: 'var(--text-muted)' }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Project name */}
      <h3 
        className="mb-1 text-lg font-semibold transition-colors group-hover:text-violet-300"
        style={{ color: 'var(--text-primary)' }}
      >
        {name}
      </h3>

      {/* Description */}
      <p 
        className="mb-4 text-sm line-clamp-2" 
        style={{ color: 'var(--text-muted)' }}
      >
        {description}
      </p>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: 'var(--text-muted)' }}>Progresso</span>
          <span className={cn("font-medium", statusInfo.color)}>{progress}%</span>
        </div>

        <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              statusInfo.progressColor
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Tasks count */}
        {tasksCompleted !== undefined && tasksTotal !== undefined && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {tasksCompleted} de {tasksTotal} tarefas
            </span>
            <span
              className={cn(
                "text-xs",
                progress === 100 ? "text-emerald-400" : ""
              )}
              style={{ color: progress === 100 ? 'var(--text-muted)' : 'var(--text-muted)' }}
            >
              {progress === 100 ? "🎉 Concluído" : "🚧 Em andamento"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
