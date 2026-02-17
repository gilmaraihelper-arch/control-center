import { NextResponse } from 'next/server';

async function checkService(url: string, timeout = 3000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, { 
      signal: controller.signal,
      method: 'HEAD'
    });
    
    clearTimeout(timeoutId);
    return response.ok || response.status < 500;
  } catch {
    return false;
  }
}

export async function GET() {
  const services = [
    { name: 'Centro de Controle', url: 'http://localhost:3001', porta: '3001' },
    { name: 'ChefExperience (Next.js)', url: 'http://localhost:3000', porta: '3000' },
    { name: 'OpenClaw Gateway', url: 'http://localhost:18789', porta: '18789' },
  ];

  const results = await Promise.all(
    services.map(async (service) => {
      const online = await checkService(service.url);
      return {
        nome: service.name,
        status: online ? 'online' : 'offline',
        porta: service.porta
      };
    })
  );

  return NextResponse.json(results);
}