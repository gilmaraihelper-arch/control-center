# 🎛️ Control Center

Dashboard centralizado para gestão de projetos, tarefas e rotinas do workspace OpenClaw.

## 🌐 URL

- **Local:** http://localhost:3000
- **Repositório:** https://github.com/gilmaraihelper-arch/control-center-app

## 🛠️ Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Theme:** LCARS (Star Trek interface)

## 📱 Funcionalidades

- **Dashboard Principal** - Visão geral do dia, tarefas, métricas
- **Quadro Trello** - Gestão de tarefas persistente
- **Calendário** - Integração com Google Calendar
- **Documentos** - Repositório centralizado
- **Configurações** - Preferências do usuário
- **Aprovações** - Fluxo de aprovação de tarefas
- **Foco do Dia** - Tarefas prioritárias do dia

## 🎨 Tema LCARS

Interface no estilo LCARS (Library Computer Access and Retrieval System) do Star Trek.
Cores principais:
- Laranja: `#FF9900`
- Azul claro: `#99CCFF`
- Roxo: `#CC99CC`

## 👥 Equipe

| Membro | Função | Emoji |
|--------|--------|-------|
| Liliana | Coordenadora | 🧠 |
| Alex | Frontend Dev | 🎨 |
| Bruno | Backend Dev | ⚙️ |
| Carol | QA Engineer | 🧪 |

## 📂 Estrutura

```
control-center-app/
├── src/
│   └── app/
│       ├── page.tsx              # Dashboard principal
│       ├── trello/               # Quadro Trello
│       ├── calendar/             # Calendário
│       ├── documents/            # Documentos
│       ├── settings/             # Configurações
│       └── approvals/            # Aprovações
├── components/                   # Componentes reutilizáveis
└── lib/                          # Utilitários
```

## 🚀 Executando

```bash
# Desenvolvimento
npm run dev

# Deploy
git add . && git commit -m "update" && git push
```

## 📋 Tarefas Pendentes

- [x] Adicionar TrampoJá ao board de projetos
- [x] Adicionar AgenteFlow ao board de projetos
- [x] Sincronizar status dos projetos
- [ ] Revisar tarefas pendentes

---

*Última atualização: 2026-03-05*
*QA Engineer: Carol*
