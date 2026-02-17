import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckCircle2, 
  Newspaper, 
  Activity,
  Settings,
  ExternalLink,
  Circle,
  Monitor,
  Bot,
  Wifi,
  AlertCircle,
  Plus,
  MoreHorizontal,
  Calendar,
  MessageSquare,
  Paperclip,
  Clock,
  Sparkles,
  Loader2,
  CheckCircle,
  RefreshCw,
  FileText,
  Mail,
  Bell,
  Terminal,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { ScrollArea } from './components/ui/scroll-area';

// ==================== TIPOS ====================
type TarefaTrello = {
  id: string;
  titulo: string;
  descricao?: string;
  etiquetas: { nome: string; cor: string }[];
  responsaveis: string[];
  comentarios: number;
  anexos: number;
  data?: string;
};

type Coluna = {
  id: string;
  titulo: string;
  tarefas: TarefaTrello[];
};

type AtividadeBot = {
  id: string;
  mensagem: string;
  tipo: 'info' | 'sucesso' | 'alerta' | 'processando';
  timestamp: Date;
  icone: 'sparkles' | 'refresh' | 'check' | 'file' | 'mail' | 'bell' | 'terminal' | 'calendar';
};

// ==================== FUNÇÕES UTILITÁRIAS ====================
function formatarDataPtBR(data: Date): string {
  const diasSemana = [
    'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira',
    'quinta-feira', 'sexta-feira', 'sábado'
  ];
  const diaSemana = diasSemana[data.getDay()];
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${diaSemana}, ${dia}/${mes}/${ano}`;
}

function formatarHora(data: Date): string {
  return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ==================== DADOS INICIAIS ====================
const colunasIniciais: Coluna[] = [
  {
    id: 'a-fazer',
    titulo: 'A Fazer',
    tarefas: [
      {
        id: 't1',
        titulo: 'Revisar protótipo do ChefExperience',
        descricao: 'Analisar telas principais e fluxo de usuário',
        etiquetas: [
          { nome: 'design', cor: 'bg-purple-500' },
          { nome: 'alta', cor: 'bg-rose-500' }
        ],
        responsaveis: ['GL'],
        comentarios: 3,
        anexos: 2,
        data: '18/02'
      },
      {
        id: 't2',
        titulo: 'Configurar ambiente de staging',
        etiquetas: [{ nome: 'devops', cor: 'bg-blue-500' }],
        responsaveis: ['GL', 'TM'],
        comentarios: 0,
        anexos: 0
      },
      {
        id: 't3',
        titulo: 'Reunião com investidores',
        etiquetas: [{ nome: 'reunião', cor: 'bg-amber-500' }],
        responsaveis: ['GL'],
        comentarios: 5,
        anexos: 1,
        data: '20/02'
      }
    ]
  },
  {
    id: 'em-progresso',
    titulo: 'Em Progresso',
    tarefas: [
      {
        id: 't4',
        titulo: 'Desenvolver API de autenticação',
        descricao: 'Implementar JWT e refresh tokens',
        etiquetas: [
          { nome: 'backend', cor: 'bg-emerald-500' },
          { nome: 'urgente', cor: 'bg-rose-500' }
        ],
        responsaveis: ['GL'],
        comentarios: 8,
        anexos: 0,
        data: '17/02'
      },
      {
        id: 't5',
        titulo: 'Criar componentes de UI',
        etiquetas: [{ nome: 'frontend', cor: 'bg-cyan-500' }],
        responsaveis: ['TM'],
        comentarios: 2,
        anexos: 4
      }
    ]
  },
  {
    id: 'revisao',
    titulo: 'Em Revisão',
    tarefas: [
      {
        id: 't6',
        titulo: 'Documentação da API',
        etiquetas: [{ nome: 'docs', cor: 'bg-slate-500' }],
        responsaveis: ['GL'],
        comentarios: 1,
        anexos: 3,
        data: '16/02'
      }
    ]
  },
  {
    id: 'concluido',
    titulo: 'Concluído',
    tarefas: [
      {
        id: 't7',
        titulo: 'Setup inicial do projeto',
        etiquetas: [{ nome: 'setup', cor: 'bg-indigo-500' }],
        responsaveis: ['GL'],
        comentarios: 0,
        anexos: 0
      },
      {
        id: 't8',
        titulo: 'Definir arquitetura',
        etiquetas: [
          { nome: 'arquitetura', cor: 'bg-violet-500' },
          { nome: 'importante', cor: 'bg-amber-500' }
        ],
        responsaveis: ['GL', 'TM'],
        comentarios: 4,
        anexos: 2
      }
    ]
  }
];

const tarefasRapidas = [
  { id: 1, texto: 'Revisar protótipo do ChefExperience', cor: 'bg-emerald-500' },
  { id: 2, texto: 'Responder e-mails pendentes', cor: 'bg-blue-500' },
  { id: 3, texto: 'Sincronizar com equipe de design', cor: 'bg-amber-500' },
  { id: 4, texto: 'Atualizar documentação do projeto', cor: 'bg-purple-500' },
  { id: 5, texto: 'Testar integrações da API', cor: 'bg-rose-500' },
];

const atalhos = [
  { id: 1, label: 'UOL Notícias', url: 'https://www.uol.com.br' },
  { id: 2, label: 'CNN Economia', url: 'https://www.cnnbrasil.com.br/economia' },
];

const statusSistema = [
  { nome: 'Centro de Controle', status: 'online', porta: null },
  { nome: 'ChefExperience (Next.js)', status: 'manual', porta: '3000' },
  { nome: 'OpenClaw Gateway', status: 'online', porta: '18789' },
];

// Atividades iniciais do bot
const atividadesIniciais: AtividadeBot[] = [
  {
    id: '1',
    mensagem: 'Assistente iniciado e pronto para ajudar',
    tipo: 'sucesso',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    icone: 'sparkles'
  },
  {
    id: '2',
    mensagem: 'Sincronizando calendário com Google Calendar...',
    tipo: 'processando',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    icone: 'refresh'
  },
  {
    id: '3',
    mensagem: '3 eventos encontrados para hoje',
    tipo: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    icone: 'calendar'
  },
  {
    id: '4',
    mensagem: 'Verificando status dos serviços...',
    tipo: 'processando',
    timestamp: new Date(Date.now() - 1000 * 60),
    icone: 'terminal'
  },
  {
    id: '5',
    mensagem: 'Todos os serviços estão online',
    tipo: 'sucesso',
    timestamp: new Date(),
    icone: 'check'
  }
];

// ==================== COMPONENTE ÍCONE DE ATIVIDADE ====================
function IconeAtividade({ icone, tipo }: { icone: AtividadeBot['icone']; tipo: AtividadeBot['tipo'] }) {
  const className = `h-4 w-4 ${tipo === 'processando' ? 'animate-spin' : ''}`;
  
  switch (icone) {
    case 'sparkles': return <Sparkles className={`h-4 w-4 text-amber-500`} />;
    case 'refresh': return <RefreshCw className={className} />;
    case 'check': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case 'file': return <FileText className="h-4 w-4 text-blue-500" />;
    case 'mail': return <Mail className="h-4 w-4 text-purple-500" />;
    case 'bell': return <Bell className="h-4 w-4 text-rose-500" />;
    case 'terminal': return <Terminal className="h-4 w-4 text-slate-500" />;
    case 'calendar': return <Calendar className="h-4 w-4 text-cyan-500" />;
    default: return <Sparkles className="h-4 w-4 text-amber-500" />;
  }
}

// ==================== COMPONENTE CARD DE TAREFA ====================
function CardTarefa({ tarefa }: { tarefa: TarefaTrello }) {
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group">
      {tarefa.etiquetas.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {tarefa.etiquetas.map((etiqueta, idx) => (
            <span
              key={idx}
              className={`${etiqueta.cor} text-white text-[10px] px-1.5 py-0.5 rounded font-medium`}
            >
              {etiqueta.nome}
            </span>
          ))}
        </div>
      )}
      
      <h4 className="text-sm font-medium text-slate-800 mb-1">{tarefa.titulo}</h4>
      
      {tarefa.descricao && (
        <p className="text-xs text-slate-500 mb-2 line-clamp-2">{tarefa.descricao}</p>
      )}
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          {tarefa.data && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              <span>{tarefa.data}</span>
            </div>
          )}
          
          {tarefa.comentarios > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MessageSquare className="h-3 w-3" />
              <span>{tarefa.comentarios}</span>
            </div>
          )}
          
          {tarefa.anexos > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Paperclip className="h-3 w-3" />
              <span>{tarefa.anexos}</span>
            </div>
          )}
        </div>
        
        <div className="flex -space-x-1">
          {tarefa.responsaveis.map((resp, idx) => (
            <div
              key={idx}
              className="w-6 h-6 rounded-full bg-slate-700 text-white text-[10px] flex items-center justify-center border-2 border-white font-medium"
              title={resp}
            >
              {resp}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== COMPONENTE COLUNA ====================
function ColunaTrello({ coluna, onAddCard }: { coluna: Coluna; onAddCard: (colunaId: string) => void }) {
  return (
    <div className="flex-shrink-0 w-72 bg-slate-100 rounded-lg max-h-full flex flex-col">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-slate-700">{coluna.titulo}</h3>
          <span className="bg-slate-200 text-slate-600 text-xs px-1.5 py-0.5 rounded-full">
            {coluna.tarefas.length}
          </span>
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
        {coluna.tarefas.map((tarefa) => (
          <CardTarefa key={tarefa.id} tarefa={tarefa} />
        ))}
      </div>
      
      <div className="p-2">
        <button
          onClick={() => onAddCard(coluna.id)}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar tarefa</span>
        </button>
      </div>
    </div>
  );
}

// ==================== COMPONENTE FEED DO BOT ====================
function FeedBot({ atividades, minimizado, onToggle }: { 
  atividades: AtividadeBot[]; 
  minimizado: boolean;
  onToggle: () => void;
}) {
  const [botPensando, setBotPensando] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBotPensando(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (minimizado) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-all"
      >
        <div className="relative">
          <Bot className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
        </div>
        <span className="text-sm font-medium">Assistente</span>
        {atividades[0]?.tipo === 'processando' && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Assistente Virtual</h3>
            <p className="text-xs text-slate-400">
              {botPensando ? 'Processando informações...' : 'Aguardando comandos'}
            </p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Status atual */}
      <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <span className="text-sm text-emerald-700 font-medium">Assistente ativo e operacional</span>
        </div>
      </div>

      {/* Feed de atividades */}
      <ScrollArea className="h-80">
        <div className="p-4 space-y-3">
          {atividades.map((atividade) => (
            <div 
              key={atividade.id} 
              className={`flex gap-3 p-3 rounded-lg transition-all ${
                atividade.tipo === 'processando' ? 'bg-amber-50 border border-amber-100' :
                atividade.tipo === 'sucesso' ? 'bg-emerald-50/50' :
                atividade.tipo === 'alerta' ? 'bg-rose-50' :
                'bg-slate-50'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                atividade.tipo === 'processando' ? 'bg-amber-100' :
                atividade.tipo === 'sucesso' ? 'bg-emerald-100' :
                atividade.tipo === 'alerta' ? 'bg-rose-100' :
                'bg-slate-100'
              }`}>
                <IconeAtividade icone={atividade.icone} tipo={atividade.tipo} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${
                  atividade.tipo === 'processando' ? 'text-amber-800' :
                  atividade.tipo === 'sucesso' ? 'text-emerald-800' :
                  atividade.tipo === 'alerta' ? 'text-rose-800' :
                  'text-slate-700'
                }`}>
                  {atividade.mensagem}
                </p>
                <span className="text-xs text-slate-400 mt-1 block">
                  {formatarHora(atividade.timestamp)}
                </span>
              </div>
              {atividade.tipo === 'processando' && (
                <Loader2 className="h-4 w-4 text-amber-500 animate-spin flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Ações rápidas */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg border border-slate-200 transition-all">
            <RefreshCw className="h-4 w-4" />
            <span>Sincronizar</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg border border-slate-200 transition-all">
            <Terminal className="h-4 w-4" />
            <span>Comandos</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== COMPONENTE SIDEBAR ====================
function Sidebar({ view, setView }: { view: 'dashboard' | 'quadro'; setView: (v: 'dashboard' | 'quadro') => void }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-slate-300 z-40">
      <div className="p-6">
        <div className="flex items-center gap-3 text-white">
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-lg font-semibold">Centro de Controle</span>
        </div>
      </div>
      
      <nav className="px-4 py-2">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                view === 'dashboard' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setView('quadro')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                view === 'quadro' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'
              }`}
            >
              <FolderKanban className="h-5 w-5" />
              <span>Quadro Trello</span>
            </button>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
              <CheckCircle2 className="h-5 w-5" />
              <span>Tarefas</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
              <Newspaper className="h-5 w-5" />
              <span>Inbox</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
              <Activity className="h-5 w-5" />
              <span>Status</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <Separator className="bg-slate-700 mb-4" />
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
          <Settings className="h-5 w-5" />
          <span>Configurações</span>
        </a>
      </div>
    </aside>
  );
}

// ==================== VIEW: DASHBOARD ====================
function DashboardView({ atividades }: { atividades: AtividadeBot[] }) {
  const [dataAtual, setDataAtual] = useState<string>('');

  useEffect(() => {
    setDataAtual(formatarDataPtBR(new Date()));
  }, []);

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Olá, Gilmar. Vamos organizar o dia.
            </h1>
            <p className="text-slate-500 mt-1 text-lg">{dataAtual}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 flex items-center gap-1.5 px-3 py-1.5">
              <Monitor className="h-3.5 w-3.5" />
              Local · apenas neste Mac
            </Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 flex items-center gap-1.5 px-3 py-1.5">
              <Bot className="h-3.5 w-3.5" />
              Assistente ativo
            </Badge>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-8">
        {/* Cards de Visão Geral */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Visão Geral</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <FolderKanban className="h-4 w-4" />
                  <span className="text-sm font-medium">Projetos</span>
                </div>
                <CardTitle className="text-lg">ChefExperience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">MVP de marketplace de chefs — em desenvolvimento</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Ativo</span>
                  <span className="text-xs text-slate-400">Next.js + Tailwind</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="text-sm font-medium">Centro de Controle</span>
                </div>
                <CardTitle className="text-lg">Status da Ferramenta</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Dashboard pessoal de organização e produtividade</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    <Wifi className="h-3 w-3 mr-1" />Online
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Foco de Hoje</span>
                </div>
                <CardTitle className="text-lg">1–2 blocos profundos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Trabalho focado sem interrupções — máxima produtividade</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Prioridade</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Grid de Blocos Inferiores */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-slate-600" />
                <CardTitle className="text-base">Tarefas Rápidas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tarefasRapidas.map((tarefa) => (
                  <li key={tarefa.id} className="flex items-center gap-3">
                    <Circle className={`h-3 w-3 fill-current ${tarefa.cor} text-transparent`} />
                    <span className="text-sm text-slate-700">{tarefa.texto}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-slate-600" />
                <CardTitle className="text-base">Inbox / Notícias</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {atalhos.map((atalho) => (
                  <a
                    key={atalho.id}
                    href={atalho.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">atalho</span>
                      <span className="text-sm text-slate-700 group-hover:text-slate-900">{atalho.label}</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-slate-600" />
                <CardTitle className="text-base">Status do Sistema</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusSistema.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">{item.nome}</span>
                    <div className="flex items-center gap-2">
                      {item.status === 'online' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <Wifi className="h-3 w-3" />online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          <AlertCircle className="h-3 w-3" />ver manualmente
                        </span>
                      )}
                      {item.porta && <span className="text-xs text-slate-400">· porta {item.porta}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card de Atividades do Assistente no Dashboard */}
        <section className="mt-8">
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-base">Atividades do Assistente</CardTitle>
                <Badge variant="secondary" className="ml-auto bg-emerald-100 text-emerald-700 text-xs">
                  Online
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {atividades.slice(0, 4).map((atividade) => (
                  <div 
                    key={atividade.id}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      atividade.tipo === 'processando' ? 'bg-amber-50 border border-amber-100' :
                      atividade.tipo === 'sucesso' ? 'bg-emerald-50' :
                      'bg-slate-50'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      atividade.tipo === 'processando' ? 'bg-amber-100' :
                      atividade.tipo === 'sucesso' ? 'bg-emerald-100' :
                      'bg-slate-100'
                    }`}>
                      <IconeAtividade icone={atividade.icone} tipo={atividade.tipo} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 line-clamp-2">{atividade.mensagem}</p>
                      <span className="text-xs text-slate-400 mt-1 block">
                        {formatarHora(atividade.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}

// ==================== VIEW: QUADRO TRELLO ====================
function QuadroTrelloView() {
  const [colunas, setColunas] = useState<Coluna[]>(colunasIniciais);
  const [novaColuna, setNovaColuna] = useState(false);
  const [tituloNovaColuna, setTituloNovaColuna] = useState('');

  const handleAddCard = (colunaId: string) => {
    const novaTarefa: TarefaTrello = {
      id: `t${Date.now()}`,
      titulo: 'Nova tarefa',
      etiquetas: [],
      responsaveis: ['GL'],
      comentarios: 0,
      anexos: 0
    };
    
    setColunas(prev => prev.map(col => 
      col.id === colunaId 
        ? { ...col, tarefas: [...col.tarefas, novaTarefa] }
        : col
    ));
  };

  const handleAddColuna = () => {
    if (tituloNovaColuna.trim()) {
      const coluna: Coluna = {
        id: `col-${Date.now()}`,
        titulo: tituloNovaColuna,
        tarefas: []
      };
      setColunas([...colunas, coluna]);
      setTituloNovaColuna('');
      setNovaColuna(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header do Quadro */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Quadro ChefExperience</h1>
              <p className="text-sm text-slate-500">Gerenciamento de tarefas do projeto</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">Projeto Ativo</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Equipe:</span>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white text-xs flex items-center justify-center border-2 border-white font-medium" title="Gilmar">GL</div>
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center border-2 border-white font-medium" title="Time">TM</div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>Calendário</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Área do Quadro */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex items-start gap-4 p-4 h-full">
          {colunas.map((coluna) => (
            <ColunaTrello 
              key={coluna.id} 
              coluna={coluna} 
              onAddCard={handleAddCard}
            />
          ))}
          
          <div className="flex-shrink-0 w-72">
            {!novaColuna ? (
              <button
                onClick={() => setNovaColuna(true)}
                className="w-full flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium">Adicionar coluna</span>
              </button>
            ) : (
              <div className="bg-slate-100 p-3 rounded-lg">
                <Input
                  placeholder="Nome da coluna..."
                  value={tituloNovaColuna}
                  onChange={(e) => setTituloNovaColuna(e.target.value)}
                  className="mb-2 bg-white"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAddColuna()}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddColuna} className="flex-1">Adicionar</Button>
                  <Button size="sm" variant="ghost" onClick={() => setNovaColuna(false)}>Cancelar</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== APP PRINCIPAL ====================
export default function App() {
  const [view, setView] = useState<'dashboard' | 'quadro'>('dashboard');
  const [feedMinimizado, setFeedMinimizado] = useState(true);
  const [atividades, setAtividades] = useState<AtividadeBot[]>(atividadesIniciais);

  // Simula novas atividades do bot periodicamente
  useEffect(() => {
    const novasMensagens = [
      { mensagem: 'Verificando novos e-mails...', tipo: 'processando' as const, icone: 'mail' as const },
      { mensagem: 'Analisando padrões de produtividade...', tipo: 'info' as const, icone: 'sparkles' as const },
      { mensagem: 'Sincronizando tarefas com calendário...', tipo: 'processando' as const, icone: 'refresh' as const },
      { mensagem: 'Backup automático concluído', tipo: 'sucesso' as const, icone: 'check' as const },
      { mensagem: 'Nova notificação do GitHub', tipo: 'info' as const, icone: 'bell' as const },
      { mensagem: 'Lembrete: reunião em 15 minutos', tipo: 'alerta' as const, icone: 'bell' as const },
    ];

    const interval = setInterval(() => {
      const randomMsg = novasMensagens[Math.floor(Math.random() * novasMensagens.length)];
      const novaAtividade: AtividadeBot = {
        id: `${Date.now()}`,
        mensagem: randomMsg.mensagem,
        tipo: randomMsg.tipo,
        timestamp: new Date(),
        icone: randomMsg.icone,
      };
      
      setAtividades(prev => [novaAtividade, ...prev].slice(0, 20));
    }, 15000); // Nova atividade a cada 15 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar view={view} setView={setView} />
      
      <main className="flex-1 ml-64">
        {view === 'dashboard' ? <DashboardView atividades={atividades} /> : <QuadroTrelloView />}
      </main>

      {/* Feed do Bot - Flutuante */}
      <FeedBot 
        atividades={atividades} 
        minimizado={feedMinimizado} 
        onToggle={() => setFeedMinimizado(!feedMinimizado)} 
      />
    </div>
  );
}
