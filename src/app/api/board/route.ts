import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'board.json');

export async function GET() {
  try {
    const data = await fs.readFile(dataFile, 'utf-8');
    return NextResponse.json(JSON.parse(data));
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