import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// GET /api/today - Buscar foco do dia
export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]

    // Se Supabase não estiver configurado, retornar dados mock
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        focus: 'Configurar Supabase',
        date: today,
        mission: 'An autonomous organization of AI agents that does work for me and produces value 24/7.',
        tasks: [],
        _mock: true
      })
    }

    // Buscar foco do dia
    const { data: focus, error: focusError } = await supabase
      .from('daily_focus')
      .select('*')
      .eq('date', today)
      .single()

    if (focusError && focusError.code !== 'PGRST116') throw focusError

    // Buscar tarefas do dia
    const { data: tasks, error: tasksError } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('focus_date', today)
      .order('ordem')

    if (tasksError) throw tasksError

    return NextResponse.json({
      focus: focus?.focus || '',
      date: today,
      mission: focus?.mission || 'An autonomous organization of AI agents that does work for me and produces value 24/7.',
      tasks: tasks || []
    })
  } catch (error) {
    console.error('Error fetching today:', error)
    return NextResponse.json(
      { error: 'Failed to fetch today data' },
      { status: 500 }
    )
  }
}

// POST /api/today - Criar/atualizar foco do dia
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { focus, mission, tasks } = body
    const today = new Date().toISOString().split('T')[0]

    // Upsert foco do dia
    const { data: focusData, error: focusError } = await supabase
      .from('daily_focus')
      .upsert({
        date: today,
        focus,
        mission
      })
      .select()
      .single()

    if (focusError) throw focusError

    // Se tiver tasks, atualizar também
    if (tasks && Array.isArray(tasks)) {
      // Deletar tasks antigas
      await supabase
        .from('daily_tasks')
        .delete()
        .eq('focus_date', today)

      // Inserir novas tasks
      const tasksToInsert = tasks.map((t, i) => ({
        focus_date: today,
        text: t.text,
        done: t.done || false,
        color: t.color || 'bg-blue-500',
        ordem: i
      }))

      const { error: tasksError } = await supabase
        .from('daily_tasks')
        .insert(tasksToInsert)

      if (tasksError) throw tasksError
    }

    return NextResponse.json({ success: true, data: focusData })
  } catch (error) {
    console.error('Error saving today:', error)
    return NextResponse.json(
      { error: 'Failed to save today data' },
      { status: 500 }
    )
  }
}

// PUT /api/today/tasks - Atualizar uma tarefa específica
export async function PUT(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { taskId, done } = body

    const { data, error } = await supabase
      .from('daily_tasks')
      .update({ done })
      .eq('id', taskId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}
