"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Search,
  ChevronRight,
  Clock,
  Tag,
  Hash,
  FileJson,
  File,
  X,
  CheckCircle2,
  Calendar,
  Users,
  FolderOpen,
  LayoutDashboard,
  CheckSquare,
  Trello,
  Settings,
  Zap,
} from "lucide-react";

// Types
interface Document {
  id: string;
  title: string;
  content?: string;
  type: string;
  category: string;
  date: string;
  modified?: string;
  path?: string;
}

// Categories
const CATEGORIES = [
  { id: "all", label: "All", color: "bg-slate-500" },
  { id: "Journal", label: "Journal", color: "bg-emerald-500" },
  { id: "Newsletters", label: "Newsletters", color: "bg-violet-500" },
  { id: "Content", label: "Content", color: "bg-amber-500" },
  { id: "Notes", label: "Notes", color: "bg-cyan-500" },
  { id: "Other", label: "Other", color: "bg-slate-500" },
];

// File types
const FILE_TYPES = [
  { id: "all", label: "All", icon: File },
  { id: "md", label: ".md", icon: FileText },
  { id: "json", label: ".json", icon: FileJson },
  { id: "config", label: "config", icon: Settings },
  { id: "note", label: "note", icon: File },
];

// Nav items (from sidebar)
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Trello, label: "Trello", href: "/trello" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: FolderOpen, label: "Docs", href: "/documents", active: true },
  { icon: Users, label: "People", href: "/people" },
  { icon: Zap, label: "Team", href: "/team" },
];

function getFileIcon(type: string) {
  switch (type) {
    case "md":
      return FileText;
    case "json":
      return FileJson;
    case "config":
      return Settings;
    default:
      return File;
  }
}

function getCategoryColor(category: string) {
  const cat = CATEGORIES.find((c) => c.id === category);
  return cat?.color || "bg-slate-500";
}

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getWordCount(content: string) {
  if (!content) return 0;
  return content.trim().split(/\s+/).filter(Boolean).length;
}

function getFileSize(content: string) {
  if (!content) return 0;
  const bytes = new Blob([content]).size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Simple markdown renderer
function renderMarkdown(content: string) {
  if (!content) return null;
  
  const lines = content.split("\n");
  
  return lines.map((line, i) => {
    const trimmed = line.trim();
    
    // Headers
    if (trimmed.startsWith("### ")) {
      return <h3 key={i} className="text-lg font-semibold text-slate-100 mt-6 mb-2">{trimmed.slice(4)}</h3>;
    }
    if (trimmed.startsWith("## ")) {
      return <h2 key={i} className="text-xl font-semibold text-slate-100 mt-6 mb-3">{trimmed.slice(3)}</h2>;
    }
    if (trimmed.startsWith("# ")) {
      return <h1 key={i} className="text-2xl font-bold text-slate-100 mt-6 mb-3">{trimmed.slice(2)}</h1>;
    }
    
    // Code blocks
    if (trimmed.startsWith("```")) {
      return null;
    }
    
    // Lists
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return <li key={i} className="ml-4 text-slate-300">{trimmed.slice(2)}</li>;
    }
    
    // Empty lines
    if (!trimmed) {
      return <br key={i} />;
    }
    
    // Regular text
    return <p key={i} className="text-slate-300 leading-relaxed mb-2">{line}</p>;
  });
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  // Fetch documents
  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (selectedCategory !== "all") params.set("category", selectedCategory);
        if (selectedType !== "all") params.set("type", selectedType);
        
        const res = await fetch(`/api/documents?${params}`);
        const data = await res.json();
        setDocuments(data.documents || []);
        
        // Auto-select first document if none selected
        if (!selectedDoc && data.documents?.length > 0) {
          setSelectedDoc(data.documents[0]);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocs();
  }, [search, selectedCategory, selectedType]);

  // Load document content when selected
  useEffect(() => {
    if (selectedDoc && !selectedDoc.content) {
      // Use API to fetch content (handles local files)
      fetch(`/api/documents-content?id=${selectedDoc.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.content) {
            setSelectedDoc((prev) => prev ? { ...prev, content: data.content } : null);
          }
        })
        .catch(console.error);
    }
  }, [selectedDoc]);

  const filteredDocuments = useMemo(() => {
    return documents;
  }, [documents]);

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-8">
      {/* Column 1: Document Browser */}
      <div className="w-80 bg-slate-900/50 border-r border-white/[0.06] flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-white/[0.06]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/50 border border-white/[0.06] rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="px-4 py-3 border-b border-white/[0.06]">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? "bg-slate-100 text-slate-900"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type filters */}
        <div className="px-4 py-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Hash className="w-3 h-3" />
            <span>File type</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILE_TYPES.map((ft) => (
              <button
                key={ft.id}
                onClick={() => setSelectedType(ft.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                  selectedType === ft.id
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-transparent"
                }`}
              >
                <ft.icon className="w-3 h-3" />
                {ft.label}
              </button>
            ))}
          </div>
        </div>

        {/* Document list */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No documents found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredDocuments.map((doc) => {
                const Icon = getFileIcon(doc.type);
                const isSelected = selectedDoc?.id === doc.id;
                
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      isSelected
                        ? "bg-violet-500/10 border border-violet-500/30"
                        : "hover:bg-white/[0.03] border border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-md ${
                        isSelected ? "bg-violet-500/20" : "bg-slate-800"
                      }`}>
                        <Icon className={`w-4 h-4 ${isSelected ? "text-violet-400" : "text-slate-400"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium truncate ${
                          isSelected ? "text-violet-200" : "text-slate-200"
                        }`}>
                          {doc.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {doc.category && doc.category !== "all" && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getCategoryColor(doc.category)}/20 text-${getCategoryColor(doc.category).replace('bg-', '')}`}>
                              {doc.category}
                            </span>
                          )}
                          <span className="text-xs text-slate-500">
                            {formatDate(doc.date || doc.modified)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Count */}
        <div className="p-3 border-t border-white/[0.06] text-xs text-slate-500">
          {filteredDocuments.length} document{filteredDocuments.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Column 2: Document Viewer */}
      <div className="flex-1 bg-slate-950 flex flex-col overflow-hidden">
        {selectedDoc ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-white/[0.06]">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <span>Docs</span>
                <ChevronRight className="w-3 h-3" />
                <span>{selectedDoc.category || "All"}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-400">{selectedDoc.title}</span>
              </div>
              
              {/* Title */}
              <h1 className="text-2xl font-semibold text-slate-100 mb-2">
                {selectedDoc.title}
              </h1>
              
              {/* Tags */}
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(selectedDoc.category)}/20 text-${getCategoryColor(selectedDoc.category).replace('bg-', '')}`}>
                  {selectedDoc.category || "Other"}
                </span>
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-400">
                  {selectedDoc.type}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="px-6 py-4 border-b border-white/[0.06] bg-slate-900/30">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <FileText className="w-4 h-4" />
                  <span>{getFileSize(selectedDoc.content || "")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Tag className="w-4 h-4" />
                  <span>{getWordCount(selectedDoc.content || "")} words</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>Modified {formatDate(selectedDoc.modified || selectedDoc.date)}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedDoc.content ? (
                <div className="prose prose-invert max-w-none">
                  {renderMarkdown(selectedDoc.content)}
                </div>
              ) : selectedDoc.path ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500">Loading content...</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500">No content available</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500">Select a document to view</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
