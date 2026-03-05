# Control Center - Deploy Supabase + Vercel

## 🚀 Quick Start

### 1. Criar projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta (ou login)
3. Crie um novo projeto
4. Copie a **Project URL** e **anon public** key

### 2. Configurar banco de dados

No SQL Editor do Supabase, execute o conteúdo de `supabase/schema.sql`:

```sql
-- Schema completo está em supabase/schema.sql
-- Isso cria todas as tabelas necessárias
```

### 3. Configurar variáveis de ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite com seus dados do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

### 4. Testar localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

### 5. Deploy no Vercel

#### Opção A: Static Export (recomendado para começar)

```bash
npm run build
# Deploy a pasta 'dist' no Vercel
```

#### Opção B: Serverless (APIs funcionam)

1. Conecte o repo no Vercel
2. Adicione as variáveis de ambiente no dashboard
3. Deploy automático

## 📁 Estrutura

```
control-center-app/
├── src/
│   ├── app/
│   │   └── api/           # APIs com Supabase
│   ├── lib/
│   │   └── supabase.ts    # Cliente Supabase
│   └── ...
├── supabase/
│   └── schema.sql         # Schema do banco
├── .env.example           # Template de variáveis
└── next.config.ts         # Config Next.js
```

## 🔧 APIs Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/board` | GET | Lista colunas e tarefas |
| `/api/board` | POST | Cria coluna/tarefa |
| `/api/board` | PUT | Atualiza coluna/tarefa |
| `/api/board` | DELETE | Remove coluna/tarefa |
| `/api/today` | GET | Foco do dia |
| `/api/today` | POST | Atualiza foco do dia |
| `/api/today` | PUT | Atualiza tarefa |

## 📝 Migração de Dados

Para migrar os dados do JSON atual para o Supabase:

1. Acesse o SQL Editor do Supabase
2. Use `INSERT` statements para importar os dados de `data/*.json`

Ou use o script (quando criarmos):
```bash
npm run migrate
```

## 🎯 Próximos Passos

- [ ] Configurar Supabase
- [ ] Importar dados existentes
- [ ] Deploy no Vercel
- [ ] Custom domain (opcional)

---

*Documentação criada: 2026-03-05*
