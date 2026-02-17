import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'today.json');

export async function GET() {
  try {
    const data = await fs.readFile(dataFile, 'utf-8');
    const today = JSON.parse(data);
    
    // Verifica se é um novo dia e reseta as tarefas se necessário
    const currentDate = new Date().toISOString().split('T')[0];
    if (today.date !== currentDate) {
      today.date = currentDate;
      today.tasks.forEach((task: any) => task.done = false);
      await fs.writeFile(dataFile, JSON.stringify(today, null, 2));
    }
    
    return NextResponse.json(today);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await fs.writeFile(dataFile, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}