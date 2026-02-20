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

// Cache em memória - válido por 30 segundos
let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 30000; // 30 segundos

export async function GET() {
  const now = Date.now();
  
  // Retorna cache se ainda válido
  if (cache && (now - cache.timestamp) < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }
  
  const services = [
    { name: 'Centro de Controle', url: 'http://localhost:3000', porta: '3000' },
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

  // Atualiza cache
  cache = { data: results, timestamp: now };

  return NextResponse.json(results);
}
