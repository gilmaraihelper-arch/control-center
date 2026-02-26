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
  color: "orange" | "blue" | "green" | "red";
  className?: string;
}

const colorStyles = {
  orange: {
    primary: "var(--lcars-orange)",
    secondary: "var(--lcars-orange-dark)",
    bg: "rgba(255, 153, 0, 0.15)",
    border: "var(--lcars-orange)",
  },
  blue: {
    primary: "var(--lcars-blue)",
    secondary: "var(--lcars-blue-dark)",
    bg: "rgba(153, 153, 204, 0.15)",
    border: "var(--lcars-blue)",
  },
  green: {
    primary: "var(--lcars-green)",
    secondary: "#558855",
    bg: "rgba(102, 153, 102, 0.15)",
    border: "var(--lcars-green)",
  },
  red: {
    primary: "var(--lcars-red)",
    secondary: "#aa0000",
    bg: "rgba(204, 0, 0, 0.15)",
    border: "var(--lcars-red)",
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
        "group relative overflow-hidden transition-all duration-300",
        "p-5",
        className
      )}
      style={{
        background: 'var(--surface)',
        border: `4px solid ${styles.border}`,
        borderRadius: '20px 4px 20px 4px',
      }}
    >
      {/* LCARS header bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-6 flex items-center px-3"
        style={{ 
          background: styles.border,
          borderRadius: '16px 0 16px 0',
        }}
      >
        <span className="text-black text-[10px] font-bold tracking-widest uppercase">
          {title}
        </span>
      </div>

      <div className="relative flex items-start justify-between mt-6">
        <div className="space-y-2">
          <p 
            className="text-4xl font-bold tracking-tight"
            style={{ color: styles.primary }}
          >
            {value}
          </p>

          {trend && (
            <div className="flex items-center gap-1.5">
              <div 
                className="flex items-center gap-1 px-2 py-1 rounded-lg"
                style={{ 
                  background: trend.positive ? 'rgba(102, 153, 102, 0.2)' : 'rgba(204, 0, 0, 0.2)',
                }}
              >
                {trend.positive ? (
                  <TrendingUp 
                    className="h-3 w-3" 
                    style={{ color: 'var(--lcars-green)' }}
                  />
                ) : (
                  <TrendingDown 
                    className="h-3 w-3" 
                    style={{ color: 'var(--lcars-red)' }}
                  />
                )}
                <span
                  className="text-xs font-bold"
                  style={{ 
                    color: trend.positive ? 'var(--lcars-green)' : 'var(--lcars-red)'
                  }}
                >
                  {trend.positive ? "+" : "-"}
                  {Math.abs(trend.value)}%
                </span>
              </div>
              
              <span className="text-[10px] tracking-wider uppercase" style={{ color: 'var(--lcars-gray-light)' }}>
                vs ontem
              </span>
            </div>
          )}
        </div>

        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{ background: styles.bg }}
        >
          <Icon 
            className="h-6 w-6" 
            style={{ color: styles.primary }}
          />
        </div>
      </div>
      
      {/* Decorative corner */}
      <div 
        className="absolute bottom-2 right-2 w-6 h-6 rounded-full opacity-30"
        style={{ background: styles.border }}
      ></div>
    </div>
  );
}
