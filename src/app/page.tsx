import {
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { ProjectCard } from "@/components/ui/project-card";

// Force dynamic rendering since we fetch from local APIs
export const dynamic = "force-dynamic";

async function getTodayData() {
  try {
    const res = await fetch("http://127.0.0.1:3001/api/today", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch today data");
    return res.json();
  } catch (error) {
    console.error("Error fetching today data:", error);
    return { tasks: [], focus: "" };
  }
}

async function getStatusData() {
  try {
    const res = await fetch("http://127.0.0.1:3001/api/status", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch status data");
    return res.json();
  } catch (error) {
    console.error("Error fetching status data:", error);
    return [];
  }
}

export default async function Dashboard() {
  const todayData = await getTodayData();
  const statusData = await getStatusData();

  // Calcular estatísticas das tarefas
  const totalTasks = todayData.tasks?.length || 0;
  const completedTasks =
    todayData.tasks?.filter((t: any) => t.done).length || 0;
  const inProgressTasks = totalTasks - completedTasks;

  // Contar projetos online
  const onlineProjects =
    statusData.filter((s: any) => s.status === "online").length || 0;
  const totalProjects = statusData.length || 3;

  // Projetos hardcoded com dados reais quando disponíveis
  const projects = [
    {
      name: "ChefExperience",
      description: "Sistema de cardápios e controle de estoque para restaurantes. Plataforma completa com dashboard administrativo.",
      progress: 85,
      status: "doing" as const,
      href: "http://localhost:3001",
      tasksCompleted: 12,
      tasksTotal: 15,
    },
    {
      name: "Control Center",
      description: "Centro de controle local para gerenciamento de projetos, tarefas diárias e monitoramento de serviços.",
      progress: 90,
      status: "doing" as const,
      href: "http://localhost:3000",
      tasksCompleted: 18,
      tasksTotal: 20,
    },
    {
      name: "OpenClaw",
      description: "Plataforma de automação e agentes de IA para produtividade. Integração com múltiplos serviços.",
      progress: 75,
      status: "doing" as const,
      href: "http://localhost:18789",
      tasksCompleted: 9,
      tasksTotal: 12,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Visão geral do seu espaço de trabalho
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Projetos"
          value={totalProjects}
          icon={FolderKanban}
          color="violet"
          trend={{ value: 12, positive: true }}
        />

        <StatsCard
          title="Tarefas Totais"
          value={totalTasks}
          icon={CheckSquare}
          color="cyan"
          trend={{ value: 8, positive: true }}
        />

        <StatsCard
          title="Concluídas"
          value={completedTasks}
          icon={CheckCircle2}
          color="emerald"
          trend={{ value: 15, positive: true }}
        />

        <StatsCard
          title="Em Andamento"
          value={inProgressTasks}
          icon={Clock}
          color="amber"
          trend={{ value: 5, positive: false }}
        />
      </div>

      {/* Projects section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Projetos</h2>
          <span className="text-sm text-slate-500">
            {onlineProjects} de {totalProjects} serviços online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.name}
              {...project}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Focus section */}
      {todayData.focus && (
        <div className="rounded-xl border border-white/[0.06] bg-gradient-to-r from-violet-500/10 via-slate-900/50 to-cyan-500/10 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <span className="text-lg">🎯</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Foco de Hoje</h3>
              <p className="mt-1 text-slate-300">{todayData.focus}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
