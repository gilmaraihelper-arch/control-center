import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'board.json');

// Cache em memória - válido por 30 segundos
let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 30000;

export async function GET() {
  const now = Date.now();
  
  if (cache && (now - cache.timestamp) < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }
  
  try {
    const data = await fs.readFile(dataFile, 'utf-8');
    const parsed = JSON.parse(data);
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
    cache = null;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
