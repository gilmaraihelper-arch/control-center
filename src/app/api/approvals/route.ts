// Approvals API Route
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const APPROVALS_FILE = path.join(process.cwd(), 'data', 'approvals.json');

interface Approval {
  id: string;
  type: 'deploy' | 'delete' | 'external' | 'config' | 'financial';
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  metadata?: Record<string, any>;
}

// Cache em memória - válido por 10 segundos
let cache: { data: Approval[]; timestamp: number } | null = null;
const CACHE_TTL = 10000;

function loadApprovals(): Approval[] {
  const now = Date.now();
  if (cache && (now - cache.timestamp) < CACHE_TTL) {
    return cache.data;
  }
  
  try {
    if (fs.existsSync(APPROVALS_FILE)) {
      const data = JSON.parse(fs.readFileSync(APPROVALS_FILE, 'utf-8'));
      cache = { data, timestamp: now };
      return data;
    }
  } catch (e) {
    console.error('Error loading approvals:', e);
  }
  return [];
}

function saveApprovals(approvals: Approval[]) {
  fs.writeFileSync(APPROVALS_FILE, JSON.stringify(approvals, null, 2));
  cache = null; // Invalida cache
}

export async function GET() {
  const approvals = loadApprovals();
  return NextResponse.json({ approvals });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, title, description, requestedBy, metadata } = body;

  const approval: Approval = {
    id: `apr-${Date.now()}`,
    type: type || 'config',
    title,
    description,
    requestedBy: requestedBy || 'system',
    requestedAt: new Date().toISOString(),
    status: 'pending',
    metadata
  };

  const approvals = loadApprovals();
  approvals.push(approval);
  saveApprovals(approvals);

  return NextResponse.json({ approval }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, status, approvedBy } = body;

  const approvals = loadApprovals();
  const index = approvals.findIndex((a: Approval) => a.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Approval not found' }, { status: 404 });
  }

  approvals[index].status = status;
  if (status === 'approved' || status === 'rejected') {
    approvals[index].approvedBy = approvedBy || 'admin';
    approvals[index].approvedAt = new Date().toISOString();
  }

  saveApprovals(approvals);
  return NextResponse.json({ approval: approvals[index] });
}
