"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [cycles, setCycles] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "work" ? WORK_TIME : BREAK_TIME);
  };

  const switchMode = () => {
    const newMode = mode === "work" ? "break" : "work";
    setMode(newMode);
    setTimeLeft(newMode === "work" ? WORK_TIME : BREAK_TIME);
    setIsActive(false);
    if (newMode === "work") {
      setCycles((c) => c + 1);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Auto switch mode when timer ends
      switchMode();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const progress = ((mode === "work" ? WORK_TIME : BREAK_TIME) - timeLeft) / (mode === "work" ? WORK_TIME : BREAK_TIME) * 100;

  return (
    <div className="bg-slate-900/50 border border-white/[0.06] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
          {mode === "work" ? (
            <Brain className="w-4 h-4 text-violet-400" />
          ) : (
            <Coffee className="w-4 h-4 text-emerald-400" />
          )}
          Pomodoro
        </h3>
        <span className="text-xs text-slate-500">
          Ciclo {cycles + 1}
        </span>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-4">
        <div className={`text-4xl font-bold font-mono tracking-tight ${
          mode === "work" ? "text-violet-400" : "text-emerald-400"
        }`}>
          {formatTime(timeLeft)}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {mode === "work" ? "Tempo de foco" : "Pausa"}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full transition-all duration-1000 ${
            mode === "work" ? "bg-violet-500" : "bg-emerald-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isActive
              ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
              : mode === "work"
              ? "bg-violet-500/10 text-violet-400 hover:bg-violet-500/20"
              : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              Pausar
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              {timeLeft === (mode === "work" ? WORK_TIME : BREAK_TIME) ? "Iniciar" : "Continuar"}
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>

        <button
          onClick={switchMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all"
        >
          {mode === "work" ? <Coffee className="w-3.5 h-3.5" /> : <Brain className="w-3.5 h-3.5" />}
          {mode === "work" ? "Pausa" : "Foco"}
        </button>
      </div>
    </div>
  );
}
