"use client";

import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "milestone" | "deadline" | "reminder" | "completed";
  project: string;
  description?: string;
}

const PROJECT_COLORS: Record<string, string> = {
  chefexperience: "bg-amber-500",
  controlcenter: "bg-cyan-500",
  openclaw: "bg-violet-500",
};

const PROJECT_NAMES: Record<string, string> = {
  chefexperience: "ChefExperience",
  controlcenter: "Control Center",
  openclaw: "OpenClaw",
};

// Mock events - in production, these would come from an API
const MOCK_EVENTS: CalendarEvent[] = [
  { id: "1", title: "Deploy ChefExperience", date: "2026-02-20", type: "milestone", project: "chefexperience", description: "Deploy para produção" },
  { id: "2", title: "Reunião de planejamento", date: "2026-02-21", type: "reminder", project: "controlcenter" },
  { id: "3", title: "Entrega MVP", date: "2026-02-28", type: "deadline", project: "openclaw", description: "Entrega do MVP completo" },
  { id: "4", title: "Testes E2E", date: "2026-02-19", type: "completed", project: "chefexperience" },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(e => e.date === dateStr);
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "completed": return <CheckCircle2 className="w-3 h-3" />;
      case "deadline": return <AlertCircle className="w-3 h-3" />;
      case "milestone": return <Clock className="w-3 h-3" />;
      default: return <Circle className="w-3 h-3" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "completed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "deadline": return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      case "milestone": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
  const todayDay = today.getDate();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-100">Calendário</h1>
            <p className="text-sm text-slate-500">
              {events.length} eventos este mês
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={goToToday}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm"
          >
            Hoje
          </button>
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
            <span className="px-4 font-medium text-slate-200 min-w-[140px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900/50 border border-white/[0.06] rounded-xl p-6">
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="h-24" />;
                }

                const dayEvents = getEventsForDate(day);
                const isToday = isCurrentMonth && day === todayDay;
                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                    className={`h-24 p-2 rounded-lg border text-left transition-all overflow-hidden ${
                      isToday
                        ? "bg-violet-500/10 border-violet-500/30"
                        : isSelected
                        ? "bg-cyan-500/10 border-cyan-500/30"
                        : "bg-slate-800/30 border-white/[0.04] hover:border-white/[0.1]"
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? "text-violet-400" : "text-slate-300"
                    }`}>
                      {day}
                      {isToday && <span className="ml-1 text-xs">(Hoje)</span>}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          className={`text-[10px] px-1.5 py-0.5 rounded truncate flex items-center gap-1 ${
                            PROJECT_COLORS[event.project]?.replace("bg-", "bg-") + "/20 text-" + PROJECT_COLORS[event.project]?.replace("bg-", "") + "-400"
                          }`}
                        >
                          {getEventTypeIcon(event.type)}
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-[10px] text-slate-500 px-1.5">
                          +{dayEvents.length - 3} mais
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar - Events List */}
        <div className="space-y-4">
          {/* Selected Date Events */}
          {selectedDate && (
            <div className="bg-slate-900/50 border border-white/[0.06] rounded-xl p-4">
              <h3 className="font-medium text-slate-100 mb-3">
                Eventos em {new Date(selectedDate).toLocaleDateString("pt-BR")}
              </h3>
              <div className="space-y-2">
                {getEventsForDate(parseInt(selectedDate.split("-")[2]))?.map(event => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-lg border ${getEventTypeColor(event.type)}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {getEventTypeIcon(event.type)}
                      <span className="font-medium text-sm">{event.title}</span>
                    </div>
                    {event.description && (
                      <p className="text-xs opacity-80 mt-1">{event.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`w-2 h-2 rounded-full ${PROJECT_COLORS[event.project]}`} />
                      <span className="text-xs">{PROJECT_NAMES[event.project]}</span>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-slate-500">Nenhum evento nesta data</p>
                )}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          <div className="bg-slate-900/50 border border-white/[0.06] rounded-xl p-4">
            <h3 className="font-medium text-slate-100 mb-3">Próximos Eventos</h3>
            <div className="space-y-3">
              {events
                .filter(e => new Date(e.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map(event => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${PROJECT_COLORS[event.project]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-200 truncate">{event.title}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(event.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${getEventTypeColor(event.type)}`}>
                      {event.type === "milestone" ? "Marco" : 
                       event.type === "deadline" ? "Prazo" : 
                       event.type === "completed" ? "Concluído" : "Lembrete"}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-slate-900/50 border border-white/[0.06] rounded-xl p-4">
            <h3 className="font-medium text-slate-100 mb-3">Legenda</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-slate-400">Marco</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-slate-400">Prazo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-slate-400">Lembrete</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-400">Concluído</span>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="bg-slate-900/50 border border-white/[0.06] rounded-xl p-4">
            <h3 className="font-medium text-slate-100 mb-3">Projetos</h3>
            <div className="space-y-2">
              {Object.entries(PROJECT_NAMES).map(([id, name]) => (
                <div key={id} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${PROJECT_COLORS[id]}`} />
                  <span className="text-sm text-slate-400">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
