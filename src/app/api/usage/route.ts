import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data/usage.json');

function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { sessions: [], agents: [] };
  }
}

function writeData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = readData();
  
  // Calculate totals
  const totalTokens = data.sessions.reduce((acc: number, s: any) => acc + (s.tokensIn || 0) + (s.tokensOut || 0), 0);
  const totalAgents = data.agents.reduce((acc: number, s: any) => acc + (s.tokensIn || 0) + (s.tokensOut || 0), 0);
  
  return NextResponse.json({
    ...data,
    totals: {
      sessions: totalTokens,
      agents: totalAgents,
      overall: totalTokens + totalAgents
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = readData();
    
    if (body.type === 'session') {
      const index = data.sessions.findIndex((s: any) => s.id === body.id);
      if (index >= 0) {
        data.sessions[index] = { ...data.sessions[index], ...body.data, updatedAt: new Date().toISOString() };
      } else {
        data.sessions.push({ ...body.data, updatedAt: new Date().toISOString() });
      }
    } else if (body.type === 'agent') {
      const index = data.agents.findIndex((a: any) => a.id === body.id);
      if (index >= 0) {
        data.agents[index] = { ...data.agents[index], ...body.data, updatedAt: new Date().toISOString() };
      } else {
        data.agents.push({ ...body.data, updatedAt: new Date().toISOString() });
      }
    }
    
    writeData(data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
  }
}
