import {
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  Clock,
  Cpu,
  Zap,
  Activity,
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
      color: "orange" as const,
    },
    {
      name: "Control Center",
      description: "Dashboard local de produtividade e gestão de projetos",
      progress: projectsData?.controlcenter?.progresso || 95,
      status: "doing" as const,
      href: "http://localhost:3000",
      tasksCompleted: projectsData?.controlcenter?.tarefas.filter((t: any) => t.status === "done").length || 7,
      tasksTotal: projectsData?.controlcenter?.tarefas.length || 8,
      color: "blue" as const,
    },
    {
      name: "OpenClaw",
      description: "Plataforma de automação e agentes de IA",
      progress: projectsData?.openclaw?.progresso || 98,
      status: "doing" as const,
      href: "http://localhost:18789",
      tasksCompleted: projectsData?.openclaw?.tarefas.filter((t: any) => t.status === "done").length || 8,
      tasksTotal: projectsData?.openclaw?.tarefas.length || 8,
      color: "green" as const,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header com estilo LCARS */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="w-2 h-12 rounded-full"
            style={{ background: 'var(--lcars-orange)' }}
          ></div>
          <div>
            <h1 
              className="text-2xl font-bold tracking-[0.15em] uppercase"
              style={{ color: 'var(--lcars-orange)' }}
            >
              Dashboard
            </h1>
            <p 
              className="text-sm tracking-wider"
              style={{ color: 'var(--lcars-gray-light)' }}
            >
              VISÃO GERAL DOS SISTEMAS
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Data estilo LCARS */}
          <div 
            className="px-4 py-2 rounded-xl flex items-center gap-3"
            style={{ 
              background: 'var(--lcars-blue)',
              borderRadius: '16px 4px 4px 16px'
            }}
          >
            <span className="text-black font-bold text-sm">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              }).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative bar */}
      <div className="flex items-center gap-2">
        <div 
          className="h-1 rounded-full flex-1"
          style={{ background: 'var(--lcars-orange)' }}
        ></div>
        <div 
          className="h-1 w-20 rounded-full"
          style={{ background: 'var(--lcars-blue)' }}
        ></div>
      </div>

      {/* Stats grid - LCARS Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Projetos Ativos"
          value={totalProjects}
          icon={FolderKanban}
          color="orange"
          trend={{ value: onlineProjects === totalProjects ? 100 : Math.round((onlineProjects/totalProjects)*100), positive: true }}
        />

        <StatsCard
          title="Tarefas Hoje"
          value={totalTasks}
          icon={CheckSquare}
          color="blue"
          trend={{ value: totalTasks > 0 ? Math.round((completedTasks/totalTasks)*100) : 0, positive: completedTasks >= inProgressTasks }}
        />

        <StatsCard
          title="Concluídas"
          value={completedTasks}
          icon={CheckCircle2}
          color="green"
          trend={{ value: completedTasks, positive: true }}
        />

        <StatsCard
          title="Kanban Total"
          value={kanbanTotal}
          icon={Clock}
          color="red"
          trend={{ value: kanbanConcluido, positive: true }}
        />
      </div>

      {/* Usage Stats - LCARS Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div 
          className="lcars-card lcars-card-blue p-6"
          style={{ borderRadius: '20px 4px 20px 4px' }}
        >
          <div className="lcars-card-header mb-4" style={{ borderRadius: '16px 4px 16px 4px' }}>
            Tokens Session
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(153, 153, 204, 0.2)' }}
            >
              <Zap className="w-5 h-5" style={{ color: 'var(--lcars-blue)' }} />
            </div>
            <div>
              <div 
                className="text-2xl font-bold"
                style={{ color: 'var(--lcars-blue)' }}
              >
                {usageData?.totals?.sessions ? (usageData.totals.sessions / 1000).toFixed(1) + 'k' : '0'}
              </div>
              <div className="text-xs text-gray-500 tracking-wider">LILIANA (MAIN)</div>
            </div>
          </div>
        </div>

        <div 
          className="lcars-card lcars-card-red p-6"
          style={{ borderRadius: '20px 4px 20px 4px' }}
        >
          <div className="lcars-card-header mb-4 !bg-[var(--lcars-red)]" style={{ borderRadius: '16px 4px 16px 4px' }}>
            Tokens Agents
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(204, 0, 0, 0.2)' }}
            >
              <Activity className="w-5 h-5" style={{ color: 'var(--lcars-red)' }} />
            </div>
            <div>
              <div 
                className="text-2xl font-bold"
                style={{ color: 'var(--lcars-red)' }}
              >
                {usageData?.totals?.agents ? (usageData.totals.agents / 1000).toFixed(1) + 'k' : '0'}
              </div>
              <div className="text-xs text-gray-500 tracking-wider">CAROL QA + OTHERS</div>
            </div>
          </div>
        </div>

        <div 
          className="lcars-card lcars-card-green p-6"
          style={{ borderRadius: '20px 4px 20px 4px' }}
        >
          <div className="lcars-card-header mb-4 !bg-[var(--lcars-green)]" style={{ borderRadius: '16px 4px 16px 4px' }}>
            Total Tokens
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(102, 153, 102, 0.2)' }}
            >
              <Cpu className="w-5 h-5" style={{ color: 'var(--lcars-green)' }} />
            </div>
            <div>
              <div 
                className="text-2xl font-bold"
                style={{ color: 'var(--lcars-green)' }}
              >
                {usageData?.totals?.overall ? (usageData.totals.overall / 1000).toFixed(1) + 'k' : '0'}
              </div>
              <div className="text-xs text-gray-500 tracking-wider">TODAS AS SESSÕES</div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects section - LCARS Style */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-1 h-8 rounded-full"
              style={{ background: 'var(--lcars-orange)' }}
            ></div>
            <h2 
              className="text-lg font-bold tracking-[0.15em] uppercase"
              style={{ color: 'var(--lcars-orange)' }}
            >
              Projetos
            </h2>
          </div>
          
          <div 
            className="text-sm px-3 py-1 rounded-lg"
            style={{ 
              background: 'var(--lcars-blue)',
              color: 'var(--lcars-black)'
            }}
          >
            <span className="font-bold">{onlineProjects}</span>
            <span className="opacity-70"> de </span>
            <span className="font-bold">{totalProjects}</span>
            <span className="opacity-70 ml-1"> ONLINE</span>
          </div>
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

      {/* Focus section - LCARS Style */}
      {todayData.focus && (
        <div 
          className="lcars-card p-6"
          style={{ borderRadius: '4px 20px 4px 20px' }}
        >
          <div className="lcars-card-header mb-4" style={{ borderRadius: '4px 16px 4px 16px' }}>
            Foco de Hoje
          </div>
          
          <div className="flex items-start gap-4">
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ background: 'rgba(255, 153, 0, 0.2)' }}
            >
              <span className="text-2xl">🎯</span>
            </div>
            <div className="flex-1">
              <p 
                className="text-lg"
                style={{ color: 'var(--lcars-orange)' }}
              >
                {todayData.focus}
              </p>
              <div 
                className="mt-2 h-1 rounded-full overflow-hidden"
                style={{ background: 'var(--lcars-gray)' }}
              >
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    background: 'var(--lcars-orange)',
                    width: '60%'
                  }}
                ></div>
              </div>
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
