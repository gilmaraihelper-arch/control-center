"use client";

import { useState, useEffect } from "react";
import { StickyNote, Plus, X, Save } from "lucide-react";

interface Note {
  id: string;
  content: string;
  color: string;
  createdAt: string;
}

const COLORS = [
  { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
  { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
  { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400" },
  { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
  { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400" },
];

export function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Load notes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cc-quick-notes");
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch {
        setNotes([]);
      }
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("cc-quick-notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!newNote.trim()) return;
    
    const color = COLORS[notes.length % COLORS.length];
    const note: Note = {
      id: Date.now().toString(),
      content: newNote.trim(),
      color: JSON.stringify(color),
      createdAt: new Date().toISOString(),
    };
    
    setNotes([note, ...notes]);
    setNewNote("");
    setIsExpanded(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const getColorClasses = (colorStr: string) => {
    try {
      return JSON.parse(colorStr);
    } catch {
      return COLORS[0];
    }
  };

  return (
    <div 
      className="rounded-xl p-4"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <StickyNote className="w-4 h-4 text-amber-400" />
          Quick Notes
          {notes.length > 0 && (
            <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>({notes.length})</span>
          )}
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          <Plus className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-45" : ""}`} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      {/* Add Note Input */}
      {isExpanded && (
        <div className="mb-3 animate-in slide-in-from-top-2 duration-200">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Digite sua nota..."
            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
            style={{ 
              backgroundColor: 'var(--surface-elevated)', 
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
            rows={2}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) {
                addNote();
              }
            }}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Cmd+Enter para salvar</span>
            <button
              onClick={addNote}
              disabled={!newNote.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: 'var(--primary-muted)', 
                color: 'var(--primary)'
              }}
            >
              <Save className="w-3.5 h-3.5" />
              Salvar
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>
            Nenhuma nota ainda.
            <br />
            Clique no + para adicionar.
          </p>
        ) : (
          notes.map((note) => {
            const colors = getColorClasses(note.color);
            return (
              <div
                key={note.id}
                className={`${colors.bg} ${colors.border} border rounded-lg p-3 group relative`}
              >
                <p className={`text-sm ${colors.text} pr-6 whitespace-pre-wrap`}>
                  {note.content}
                </p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="absolute top-2 right-2 w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  <X className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
