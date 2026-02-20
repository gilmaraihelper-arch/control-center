import {
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  Clock,
  Cpu,
} from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { ProjectCard } from "@/components/ui/project-card";
import { QuickNotes } from "@/components/quick-notes";

// Force dynamic rendering since we fetch from local APIs
export const dynamic = "force-dynamic";

// Cache simples em memória para as requisições do servidor
const fetchCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10000; // 10 segundos para dados do servidor

async function fetchWithCache(url: string): Promise<any> {
  const now = Date.now();
  const cached = fetchCache.get(url);
  
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    const res = await fetch(url, { 
      cache: "no-store"
    });
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const data = await res.json();
    fetchCache.set(url, { data, timestamp: now });
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

async function getTodayData() {
  return fetchWithCache("http://localhost:3000/api/today");
}

async function getStatusData() {
  return fetchWithCache("http://localhost:3000/api/status");
}

async function getProjectsData() {
  return fetchWithCache("http://localhost:3000/api/projects");
}

async function getBoardData() {
  return fetchWithCache("http://localhost:3000/api/board");
}

async function getUsageData() {
  return fetchWithCache("http://localhost:3000/api/usage");
}

export default async function Dashboard() {
  // Buscar todos os dados em paralelo para performance
  const [todayData, statusData, projectsData, boardData, usageData] = await Promise.all([
    getTodayData(),
    getStatusData(),
    getProjectsData(),
    getBoardData(),
    getUsageData()
  ]);

  // Calcular estatísticas das tarefas
  const totalTasks = todayData.tasks?.length || 0;
  const completedTasks =
    todayData.tasks?.filter((t: any) => t.done).length || 0;
  const inProgressTasks = totalTasks - completedTasks;

  // Contar projetos online
  const onlineProjects =
    statusData.filter((s: any) => s.status === "online").length || 0;
  const totalProjects = statusData.length || 3;

  // Calcular tarefas do Kanban
  const kanbanTotal = boardData.columns?.reduce((acc: number, col: any) => acc + col.tarefas.length, 0) || 0;
  const kanbanConcluido = boardData.columns?.find((c: any) => c.id === "concluido")?.tarefas.length || 0;

  // Projetos com dados REAIS do JSON
  const projects = [
    {
      name: "ChefExperience",
      description: "Marketplace de gastronomia - conecta chefs a clientes para eventos",
      progress: projectsData?.chefexperience?.progresso || 100,
      status: "doing" as const,
      href: "http://localhost:3000",
      tasksCompleted: projectsData?.chefexperience?.tarefas.filter((t: any) => t.status === "done").length || 21,
      tasksTotal: projectsData?.chefexperience?.tarefas.length || 21,
    },
    {
      name: "Control Center",
      description: "Dashboard local de produtividade e gestão de projetos",
      progress: projectsData?.controlcenter?.progresso || 95,
      status: "doing" as const,
      href: "http://localhost:3000",
      tasksCompleted: projectsData?.controlcenter?.tarefas.filter((t: any) => t.status === "done").length || 7,
      tasksTotal: projectsData?.controlcenter?.tarefas.length || 8,
    },
    {
      name: "OpenClaw",
      description: "Plataforma de automação e agentes de IA",
      progress: projectsData?.openclaw?.progresso || 98,
      status: "doing" as const,
      href: "http://localhost:18789",
      tasksCompleted: projectsData?.openclaw?.tarefas.filter((t: any) => t.status === "done").length || 8,
      tasksTotal: projectsData?.openclaw?.tarefas.length || 8,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
            Visão geral dos seus projetos e tarefas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats grid - DADOS REAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Projetos Ativos"
          value={totalProjects}
          icon={FolderKanban}
          color="violet"
          trend={{ value: onlineProjects === totalProjects ? 100 : Math.round((onlineProjects/totalProjects)*100), positive: true }}
        />

        <StatsCard
          title="Tarefas Hoje"
          value={totalTasks}
          icon={CheckSquare}
          color="cyan"
          trend={{ value: totalTasks > 0 ? Math.round((completedTasks/totalTasks)*100) : 0, positive: completedTasks >= inProgressTasks }}
        />

        <StatsCard
          title="Concluídas"
          value={completedTasks}
          icon={CheckCircle2}
          color="emerald"
          trend={{ value: completedTasks, positive: true }}
        />

        <StatsCard
          title="Kanban Total"
          value={kanbanTotal}
          icon={Clock}
          color="amber"
          trend={{ value: kanbanConcluido, positive: true }}
        />
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-slate-900/50 border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Tokens Session</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {usageData?.totals?.sessions ? (usageData.totals.sessions / 1000).toFixed(1) + 'k' : '0'}
              </div>
            </div>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Liliana (Main)
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Tokens Agents</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {usageData?.totals?.agents ? (usageData.totals.agents / 1000).toFixed(1) + 'k' : '0'}
              </div>
            </div>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Carol QA + others
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Tokens</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {usageData?.totals?.overall ? (usageData.totals.overall / 1000).toFixed(1) + 'k' : '0'}
              </div>
            </div>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Todas as sessões
          </div>
        </div>
      </div>

      {/* Projects section - DADOS REAIS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Projetos</h2>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
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
        <div className="rounded-xl border p-6 bg-gradient-to-r from-violet-500/10 via-transparent to-cyan-500/10" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <span className="text-lg">🎯</span>
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Foco de Hoje</h3>
              <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{todayData.focus}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tools Section - Quick Notes */}
      <div className="max-w-2xl">
        <QuickNotes />
      </div>
    </div>
  );
}
