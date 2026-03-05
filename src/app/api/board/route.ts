import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// GET /api/board - Listar todas as colunas e tarefas
export async function GET() {
  try {
    // Se Supabase não estiver configurado, retornar dados mock
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ 
        columns: [],
        _error: 'Supabase not configured',
        _mock: true 
      })
    }

    // Buscar colunas
    const { data: columns, error: columnsError } = await supabase
      .from('board_columns')
      .select('*')
      .order('ordem')

    if (columnsError) throw columnsError

    // Buscar tarefas
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .order('ordem')

    if (tasksError) throw tasksError

    // Agrupar tarefas por coluna
    const columnsWithTasks = columns?.map(col => ({
      ...col,
      tarefas: tasks?.filter(t => t.column_id === col.id) || []
    })) || []

    return NextResponse.json({ columns: columnsWithTasks })
  } catch (error) {
    console.error('Error fetching board:', error)
    return NextResponse.json(
      { error: 'Failed to fetch board' },
      { status: 500 }
    )
  }
}

// POST /api/board - Criar nova coluna ou tarefa
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { type, data } = body

    if (type === 'column') {
      const { data: column, error } = await supabase
        .from('board_columns')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(column)
    }

    if (type === 'task') {
      const { data: task, error } = await supabase
        .from('tasks')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(task)
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    )
  }
}

// PUT /api/board - Atualizar coluna ou tarefa
export async function PUT(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { type, id, data } = body

    if (type === 'column') {
      const { data: column, error } = await supabase
        .from('board_columns')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(column)
    }

    if (type === 'task') {
      const { data: task, error } = await supabase
        .from('tasks')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(task)
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error updating item:', error)
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    )
  }
}

// DELETE /api/board - Deletar coluna ou tarefa
export async function DELETE(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Missing type or id' },
        { status: 400 }
      )
    }

    if (type === 'column') {
      const { error } = await supabase
        .from('board_columns')
        .delete()
        .eq('id', id)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    if (type === 'task') {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}
