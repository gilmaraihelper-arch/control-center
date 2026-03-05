-- Schema do Control Center para Supabase
-- Criar tabelas para substituir os arquivos JSON

-- Tabela: Quadro (board) - Colunas do Trello
CREATE TABLE IF NOT EXISTS board_columns (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: Tarefas
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    column_id TEXT REFERENCES board_columns(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT,
    etiquetas JSONB DEFAULT '[]',
    responsaveis TEXT[] DEFAULT '{}',
    comentarios INTEGER DEFAULT 0,
    anexos INTEGER DEFAULT 0,
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: Foco do Dia (today)
CREATE TABLE IF NOT EXISTS daily_focus (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    focus TEXT,
    mission TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: Tarefas do Dia
CREATE TABLE IF NOT EXISTS daily_tasks (
    id SERIAL PRIMARY KEY,
    focus_date DATE REFERENCES daily_focus(date) ON DELETE CASCADE,
    text TEXT NOT NULL,
    done BOOLEAN DEFAULT FALSE,
    color TEXT DEFAULT 'bg-blue-500',
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: Documentos
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo TEXT,
    data TEXT,
    url TEXT,
    tags TEXT[] DEFAULT '{}',
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: Projetos
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    progresso INTEGER DEFAULT 0,
    descricao TEXT,
    tags TEXT[] DEFAULT '{}',
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: Atividades
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    tipo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    autor TEXT,
    projeto TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tasks_column ON tasks(column_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_date ON daily_tasks(focus_date);
CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_board_columns_updated_at BEFORE UPDATE ON board_columns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_focus_updated_at BEFORE UPDATE ON daily_focus
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_tasks_updated_at BEFORE UPDATE ON daily_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data (dados iniciais)
INSERT INTO board_columns (id, titulo, ordem) VALUES
    ('a-fazer', 'A Fazer', 0),
    ('em-progresso', 'Em Progresso', 1),
    ('revisao', 'Revisão', 2),
    ('concluido', 'Concluído', 3)
ON CONFLICT (id) DO NOTHING;
