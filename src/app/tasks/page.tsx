"use client";

import { useState, useEffect } from "react";
import { 
  CheckSquare, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp,
  FolderKanban,
  Calendar,
  Target,
  AlertCircle
} from "lucide-react";

interface ProjectTask {
  id: string;
  titulo: string;
  status: "done" | "todo" | "doing";
  nota?: string;
}

interface Project {
  id: string;
  nome: string;
  progresso: number;
  tarefas: ProjectTask[];
}

const PROJECT_COLORS: Record<string, string> = {
  chefexperience: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
  controlcenter: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400",
  openclaw: "from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400",
  agenteflow: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400",
};

const PROJECT_ICONS: Record<string, string> = {
  chefexperience: "🍳",
  controlcenter: "🎛️",
  openclaw: "🤖",
  agenteflow: "⚡",
};

const PROJECT_NAMES: Record<string, string> = {
  chefexperience: "ChefExperience",
  controlcenter: "Control Center",
  openclaw: "OpenClaw",
  agenteflow: "AgenteFlow",
};

export default function TasksPage() {
  const [projects, setProjects] = useState<Record<string, Project>>({});
  const [loading, setLoading] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState<string[]>(["chefexperience"]);
  const [activeTab, setActiveTab] = useState<"projects" | "daily">("projects");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const toggleTaskStatus = async (projectId: string, taskId: string) => {
    const project = projects[projectId];
    if (!project) return;

    const updatedTasks = project.tarefas.map((task) =>
      task.id === taskId
        ? { ...task, status: task.status === "done" ? "todo" : "done" as "done" | "todo" }
        : task
    );

    const doneCount = updatedTasks.filter((t) => t.status === "done").length;
    const newProgress = Math.round((doneCount / updatedTasks.length) * 100);

    const updatedProject = {
      ...project,
      tarefas: updatedTasks,
      progresso: newProgress,
    };

    const updatedProjects = { ...projects, [projectId]: updatedProject };
    setProjects(updatedProjects);

    // Save to API
    try {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProjects),
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const getProjectStats = (project: Project) => {
    const total = project.tarefas.length;
    const done = project.tarefas.filter((t) => t.status === "done").length;
    const todo = total - done;
    return { total, done, todo };
  };

  const getOverallStats = () => {
    const allTasks = Object.values(projects).flatMap((p) => p.tarefas);
    const total = allTasks.length;
    const done = allTasks.filter((t) => t.status === "done").length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, progress };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Carregando tarefas...</div>
      </div>
    );
  }

  const stats = getOverallStats();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Target className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-100">Tarefas por Projeto</h1>
            <p className="text-sm text-slate-500">
              {stats.done} de {stats.total} tarefas concluídas ({stats.progress}%)
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-100">{stats.progress}%</div>
            <div className="text-xs text-slate-500">Progresso Geral</div>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - stats.progress / 100)}
                className="text-cyan-500 transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {Object.entries(projects).map(([projectId, project]) => {
          const { total, done, todo } = getProjectStats(project);
          const isExpanded = expandedProjects.includes(projectId);
          const colorClass = PROJECT_COLORS[projectId] || PROJECT_COLORS.controlcenter;
          const icon = PROJECT_ICONS[projectId] || "📁";

          return (
            <div
              key={projectId}
              className="bg-slate-900/50 border border-white/[0.06] rounded-xl overflow-hidden"
            >
              {/* Project Header */}
              <button
                onClick={() => toggleProject(projectId)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-lg`}
                  >
                    {icon}
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-100 text-left">
                      {PROJECT_NAMES[projectId] || projectId}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {done}/{total} concluídas • {todo} pendentes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Progress Bar */}
                  <div className="w-32 hidden sm:block">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Progresso</span>
                      <span className="text-slate-300">{project.progresso}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          project.progresso === 100
                            ? "bg-emerald-500"
                            : project.progresso >= 50
                            ? "bg-cyan-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${project.progresso}%` }}
                      />
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Tasks List */}
              {isExpanded && (
                <div className="border-t border-white/[0.06] p-4 space-y-2">
                  {project.tarefas.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskStatus(projectId, task.id)}
                      className={`group flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        task.status === "done"
                          ? "bg-emerald-500/5 border border-emerald-500/20"
                          : "bg-slate-800/50 border border-white/[0.04] hover:border-cyan-500/30"
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {task.status === "done" ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-600 group-hover:border-cyan-500 transition-colors" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${
                            task.status === "done"
                              ? "line-through text-slate-500"
                              : "text-slate-200"
                          }`}
                        >
                          {task.titulo}
                        </p>
                        {task.nota && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {task.nota}
                          </p>
                        )}
                      </div>

                      <div className="flex-shrink-0">
                        {task.status === "done" ? (
                          <span className="px-2 py-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 rounded-full">
                            OK
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 rounded-full">
                            PENDENTE
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {project.tarefas.length === 0 && (
                    <div className="text-center py-6 text-slate-500">
                      <FolderKanban className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhuma tarefa neste projeto</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(projects).map(([projectId, project]) => {
          const { done, total } = getProjectStats(project);
          const colorClass = PROJECT_COLORS[projectId] || PROJECT_COLORS.controlcenter;
          
          return (
            <div
              key={projectId}
              className={`bg-slate-900/50 border border-white/[0.06] rounded-xl p-4 ${
                done === total ? "border-emerald-500/30" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${colorClass.split(" ")[2].replace("text-", "bg-")}`} />
                <span className="text-xs text-slate-400 uppercase tracking-wider">
                  {PROJECT_NAMES[projectId] || projectId}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-100">
                {done}/{total}
              </div>
              <div className="text-xs text-slate-500">
                {done === total ? "✅ Completo" : `${total - done} restantes`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
          </div>
          <span>Concluído (OK)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
          <span>Pendente</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>Clique para marcar</span>
        </div>
      </div>
    </div>
  );
}
