import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DOCUMENTS_FILE = path.join(DATA_DIR, "documents.json");

// Cache em memória - válido por 30 segundos
let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 30000;

function loadDocuments() {
  const now = Date.now();
  if (cache && (now - cache.timestamp) < CACHE_TTL) {
    return cache.data;
  }
  
  if (!fs.existsSync(DOCUMENTS_FILE)) {
    return { documents: [] };
  }

  const data = fs.readFileSync(DOCUMENTS_FILE, "utf-8");
  const parsed = JSON.parse(data);
  cache = { data: parsed, timestamp: now };
  return parsed;
}

function saveDocuments(documents: any) {
  fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(documents, null, 2));
  cache = null; // Invalida cache
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const category = searchParams.get("category") || "";
    const type = searchParams.get("type") || "";

    let json = loadDocuments();
    let documents = json.documents || [];

    // Filter by search
    if (search) {
      documents = documents.filter((doc: any) =>
        doc.title?.toLowerCase().includes(search) ||
        doc.content?.toLowerCase().includes(search)
      );
    }

    // Filter by category
    if (category) {
      documents = documents.filter((doc: any) => doc.category === category);
    }

    // Filter by type
    if (type) {
      documents = documents.filter((doc: any) => doc.type === type);
    }

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Error reading documents:", error);
    return NextResponse.json({ documents: [], error: "Failed to read documents" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, type, category } = body;

    let documents = loadDocuments();
    if (!documents.documents) documents.documents = [];

    const newDocument = {
      id: Date.now().toString(),
      title,
      content,
      type: type || "note",
      category: category || "Other",
      date: new Date().toISOString().split("T")[0],
      modified: new Date().toISOString()
    };

    documents.documents.push(newDocument);
    saveDocuments(documents);

    return NextResponse.json(newDocument);
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, content, type, category } = body;

    let documents = loadDocuments();
    if (!documents.documents) {
      return NextResponse.json({ error: "Documents file not found" }, { status: 404 });
    }

    const docIndex = documents.documents.findIndex((d: any) => d.id === id);
    if (docIndex === -1) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    documents.documents[docIndex] = {
      ...documents.documents[docIndex],
      title: title || documents.documents[docIndex].title,
      content: content || documents.documents[docIndex].content,
      type: type || documents.documents[docIndex].type,
      category: category || documents.documents[docIndex].category,
      modified: new Date().toISOString()
    };

    saveDocuments(documents);

    return NextResponse.json(documents.documents[docIndex]);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
  }
}
