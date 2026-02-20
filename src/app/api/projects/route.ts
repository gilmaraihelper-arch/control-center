import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'projects-todos.json');

// Cache em memória - válido por 60 segundos para dados de projetos
let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 60000; // 60 segundos

export async function GET() {
  const now = Date.now();
  
  // Retorna cache se ainda válido
  if (cache && (now - cache.timestamp) < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }
  
  try {
    const data = await fs.readFile(dataFile, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Atualiza cache
    cache = { data: parsed, timestamp: now };
    
    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await fs.writeFile(dataFile, JSON.stringify(body, null, 2));
    
    // Invalida cache após modificação
    cache = null;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
