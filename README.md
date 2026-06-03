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

## 📋 Tarefas Concluídas (2026-03-14)

- [x] Tema LCARS implementado
- [x] Configuração Supabase para deploy Vercel
- [x] Adicionar TrampoJá ao board de projetos
- [x] Adicionar AgenteFlow ao board de projetos
- [x] Adicionar TalentDash ao board de projetos
- [x] Adicionar Liliana Voice ao board de projetos
- [x] Sincronizar status dos projetos
- [x] Dashboard principal com visão geral
- [x] Quadro Trello funcional
- [x] Calendário integrado
- [x] Repositório de documentos

---

## 📋 Tarefas Pendentes

- [ ] Revisar tarefas pendentes
- [ ] Adicionar mais métricas ao dashboard
- [ ] Integrar Google Calendar (em progresso)
- [x] Adicionar projetos BM Vagas ao board

---

## 🆕 Projetos no Board (2026-05-29)

### Projetos Ativos
| Projeto | Progresso | Status |
|---------|-----------|--------|
| ChefExperience | 100% | ✅ Concluído |
| Control Center | 95% | 🔄 Em desenvolvimento |
| AgenteFlow | 40% | 🚀 Em progresso |
| TalentDash | 100% | ✅ Lançado |
| BM Vagas J&J | 80% | 🚀 Em progresso |
| BM Vagas Straumann | 80% | 🚀 Em progresso |
| Conecta RH | 60% | 🚀 Em progresso |
| SocialChef | 97% | ✅ MVP Completo |
| NewsFlow | 50% | 🚀 Em progresso |
| TrampoJá | 30% | 🆕 Início |

---

## 🆕 Liliana Voice Server (2026-03-15)
- **URL:** http://localhost:3003
- **Stack:** Node.js + WebSocket, ElevenLabs Conversational AI
- **Status:** ✅ Implementado

## 🔗 Links Úteis

- **Vercel:** https://control-center-app.vercel.app
- **Supabase:** https://supabase.com/dashboard
- **OpenClaw Gateway:** http://localhost:18789

---

*Última atualização: 2026-06-03*
*QA Engineer: Carol (Revisão docs - 03/06/2026)*
