import * as React from "react";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  color: "violet" | "cyan" | "emerald" | "amber";
  className?: string;
}

const colorStyles = {
  violet: {
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    trendUp: "text-violet-400",
    trendDown: "text-violet-400/70",
  },
  cyan: {
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    trendUp: "text-cyan-400",
    trendDown: "text-cyan-400/70",
  },
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    trendUp: "text-emerald-400",
    trendDown: "text-emerald-400/70",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    trendUp: "text-amber-400",
    trendDown: "text-amber-400/70",
  },
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  className,
}: StatsCardProps) {
  const styles = colorStyles[color];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/[0.06] bg-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.1] hover:bg-slate-900/80 hover:shadow-lg hover:shadow-violet-500/5",
        className
      )}
    >
      {/* Glow effect on hover */}
      <div
        className={cn(
          "absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          color === "violet" && "bg-gradient-to-br from-violet-500/5 to-transparent",
          color === "cyan" && "bg-gradient-to-br from-cyan-500/5 to-transparent",
          color === "emerald" && "bg-gradient-to-br from-emerald-500/5 to-transparent",
          color === "amber" && "bg-gradient-to-br from-amber-500/5 to-transparent"
        )}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-slate-100">
            {value}
          </p>

          {trend && (
            <div className="flex items-center gap-1.5">
              {trend.positive ? (
                <TrendingUp className={cn("h-4 w-4", styles.trendUp)} />
              ) : (
                <TrendingDown className={cn("h-4 w-4", styles.trendDown)} />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.positive ? styles.trendUp : styles.trendDown
                )}
              >
                {trend.positive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-slate-500">vs ontem</span>
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
            styles.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", styles.iconColor)} />
        </div>
      </div>
    </div>
  );
}
