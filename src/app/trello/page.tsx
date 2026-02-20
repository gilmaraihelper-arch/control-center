"use client";

import { useState, useEffect } from "react";
import { Trello, Plus, MoreHorizontal, Calendar, Tag, User } from "lucide-react";

interface Task {
  id: string;
  titulo: string;
  descricao?: string;
  etiquetas?: Array<{
    nome: string;
    cor: string;
  }>;
  responsaveis?: string[];
  comentarios?: number;
  anexos?: number;
  data?: string;
}

interface Column {
  id: string;
  titulo: string;
  tarefas: Task[];
}

interface BoardData {
  columns: Column[];
}

export default function TrelloPage() {
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBoardData();
  }, []);

  const fetchBoardData = async () => {
    try {
      const res = await fetch("/api/board");
      if (!res.ok) throw new Error("Failed to fetch board data");
      const data = await res.json();
      setBoardData(data);
    } catch (err) {
      setError("Erro ao carregar quadro");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Carregando quadro...</div>
      </div>
    );
  }

  if (error || !boardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-rose-400">{error || "Erro ao carregar dados"}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
            <Trello className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-100">Quadro Kanban</h1>
            <p className="text-sm text-slate-500">
              {boardData.columns.reduce((acc, col) => acc + col.tarefas.length, 0)} tarefas em {boardData.columns.length} colunas
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          Nova Tarefa
        </button>
      </div>

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {boardData.columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 bg-slate-900/50 border border-white/[0.06] rounded-xl"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <h3 className="font-medium text-slate-200">{column.titulo}</h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-medium text-slate-400 bg-white/[0.06] rounded-full">
                  {column.tarefas.length}
                </span>
                <button className="p-1 rounded hover:bg-white/[0.06] text-slate-400">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tasks */}
            <div className="p-3 space-y-3">
              {column.tarefas.map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-800/50 border border-white/[0.06] rounded-lg p-3 hover:border-violet-500/30 transition-colors cursor-pointer group"
                >
                  {/* Etiquetas */}
                  {task.etiquetas && task.etiquetas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {task.etiquetas.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${tag.cor} text-white`}
                        >
                          {tag.nome}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Título */}
                  <h4 className="text-sm font-medium text-slate-200 mb-1">{task.titulo}</h4>

                  {/* Descrição */}
                  {task.descricao && (
                    <p className="text-xs text-slate-500 mb-2 line-clamp-2">{task.descricao}</p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      {/* Responsáveis */}
                      {task.responsaveis && task.responsaveis.length > 0 && (
                        <div className="flex -space-x-1">
                          {task.responsaveis.slice(0, 3).map((resp, idx) => (
                            <div
                              key={idx}
                              className="w-5 h-5 rounded-full bg-violet-500/20 border border-slate-800 flex items-center justify-center text-[8px] font-bold text-violet-300"
                            >
                              {resp.charAt(0)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-slate-500">
                      {/* Data */}
                      {task.data && (
                        <div className="flex items-center gap-1 text-[10px]">
                          <Calendar className="w-3 h-3" />
                          {task.data}
                        </div>
                      )}

                      {/* Comentários */}
                      {task.comentarios > 0 && (
                        <div className="flex items-center gap-1 text-[10px]">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {task.comentarios}
                        </div>
                      )}

                      {/* Anexos */}
                      {task.anexos > 0 && (
                        <div className="flex items-center gap-1 text-[10px]">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          {task.anexos}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Task Button */}
              <button className="w-full py-2 rounded-lg border border-dashed border-white/[0.1] text-slate-500 hover:text-slate-300 hover:border-white/[0.2] hover:bg-white/[0.02] transition-all text-sm flex items-center justify-center gap-1">
                <Plus className="w-4 h-4" />
                Adicionar tarefa
              </button>
            </div>
          </div>
        ))}

        {/* Add Column Button */}
        <button className="flex-shrink-0 w-80 h-16 rounded-xl border border-dashed border-white/[0.1] text-slate-500 hover:text-slate-300 hover:border-white/[0.2] hover:bg-white/[0.02] transition-all flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Adicionar coluna
        </button>
      </div>
    </div>
  );
}
