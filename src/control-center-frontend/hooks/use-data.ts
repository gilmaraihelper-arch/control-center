import { useState, useEffect } from 'react';

export interface TarefaTrello {
  id: string;
  titulo: string;
  descricao?: string;
  etiquetas: { nome: string; cor: string }[];
  responsaveis: string[];
  comentarios: number;
  anexos: number;
  data?: string;
}

export interface Coluna {
  id: string;
  titulo: string;
  tarefas: TarefaTrello[];
}

export interface TodayData {
  focus: string;
  date: string;
  tasks: { id: number; text: string; done: boolean; color: string }[];
}

export interface StatusData {
  nome: string;
  status: 'online' | 'offline' | 'manual';
  porta: string;
}

export function useTodayData() {
  const [data, setData] = useState<TodayData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/today')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const saveData = async (newData: TodayData) => {
    await fetch('/api/today', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
    setData(newData);
  };

  const toggleTask = async (taskId: number) => {
    if (!data) return;
    const newTasks = data.tasks.map(t =>
      t.id === taskId ? { ...t, done: !t.done } : t
    );
    const newData = { ...data, tasks: newTasks };
    await saveData(newData);
  };

  const updateFocus = async (focus: string) => {
    if (!data) return;
    await saveData({ ...data, focus });
  };

  return { data, loading, toggleTask, updateFocus };
}

export function useBoardData() {
  const [data, setData] = useState<{ columns: Coluna[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/board')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const saveBoard = async (columns: Coluna[]) => {
    await fetch('/api/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ columns })
    });
    setData({ columns });
  };

  return { data, loading, saveBoard };
}

export function useStatusData() {
  const [data, setData] = useState<StatusData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = () => {
      fetch('/api/status')
        .then(r => r.json())
        .then(setData)
        .finally(() => setLoading(false));
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return { data, loading };
}