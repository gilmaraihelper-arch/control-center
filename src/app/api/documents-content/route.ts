// Documents API - serves local .md files
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const WORKSPACE_DIR = '/Users/gilmaraihelper/.openclaw/workspace-main';
const DATA_FILE = path.join(process.cwd(), 'data', 'documents.json');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const docId = searchParams.get('id');
  
  // Load documents metadata
  let documents = [];
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      documents = data.documents || [];
    }
  } catch (e) {
    console.error('Error loading documents:', e);
  }

  // If requesting specific document content
  if (docId) {
    const doc = documents.find((d: any) => d.id === docId);
    if (doc?.path) {
      // Check if it's a local workspace path
      if (doc.path.startsWith('/Users/') || doc.path.startsWith(WORKSPACE_DIR)) {
        try {
          const content = fs.readFileSync(doc.path, 'utf-8');
          return NextResponse.json({ content, title: doc.title });
        } catch (e) {
          return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }
      }
      // External URL - proxy it
      try {
        const res = await fetch(doc.path);
        const content = await res.text();
        return NextResponse.json({ content, title: doc.title });
      } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 404 });
      }
    }
    // Return stored content
    if (doc?.content) {
      return NextResponse.json({ content: doc.content, title: doc.title });
    }
  }

  return NextResponse.json({ documents });
}
