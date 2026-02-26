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
  { border: "var(--lcars-orange)", bg: "rgba(255, 153, 0, 0.1)", text: "var(--lcars-orange)" },
  { border: "var(--lcars-blue)", bg: "rgba(153, 153, 204, 0.1)", text: "var(--lcars-blue)" },
  { border: "var(--lcars-green)", bg: "rgba(102, 153, 102, 0.1)", text: "var(--lcars-green)" },
  { border: "var(--lcars-red)", bg: "rgba(204, 0, 0, 0.1)", text: "var(--lcars-red)" },
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
      className="p-5"
      style={{ 
        background: 'var(--surface)', 
        border: '4px solid var(--lcars-orange)',
        borderRadius: '4px 20px 4px 20px',
      }}
    >
      {/* LCARS Header */}
      <div 
        className="h-6 flex items-center px-3 -mt-5 -mx-5 mb-4"
        style={{ 
          background: 'var(--lcars-orange)',
          borderRadius: '0 16px 0 16px',
        }}
      >
        <span className="text-black text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
          <StickyNote className="w-3 h-3" />
          Quick Notes
          {notes.length > 0 && (
            <span className="bg-black/20 px-2 py-0.5 rounded text-[9px]">
              {notes.length}
            </span>
          )}
        </span>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto w-5 h-5 rounded flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
        >
          <Plus className={`w-3 h-3 text-black transition-transform ${isExpanded ? "rotate-45" : ""}`} />
        </button>
      </div>

      {/* Add Note Input */}
      {isExpanded && (
        <div className="mb-4 animate-fade-in-up">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Digite sua nota..."
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
            style={{ 
              background: 'var(--surface-elevated)', 
              border: '2px solid var(--lcars-blue)',
              color: 'var(--lcars-orange)',
              borderRadius: '12px 4px 12px 4px',
            }}
            rows={2}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) {
                addNote();
              }
            }}
          />
          <div className="flex items-center justify-between mt-3">
            <span 
              className="text-[10px] tracking-wider"
              style={{ color: 'var(--lcars-gray-light)' }}
            >
              CMD+ENTER PARA SALVAR
            </span>
            <button
              onClick={addNote}
              disabled={!newNote.trim()}
              className="lcars-button flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: '12px 4px 12px 4px' }}
            >
              <Save className="w-3.5 h-3.5" />
              SALVAR
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <div 
            className="text-center py-6 rounded-xl"
            style={{ 
              border: '2px dashed var(--lcars-gray)',
              background: 'rgba(51, 51, 51, 0.3)',
            }}
          >
            <p className="text-xs tracking-wider" style={{ color: 'var(--lcars-gray-light)' }}>
              NENHUMA NOTA REGISTRADA
            </p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--lcars-gray-light)' }}>
              Clique no + para adicionar
            </p>
          </div>
        ) : (
          notes.map((note) => {
            const colors = getColorClasses(note.color);
            return (
              <div
                key={note.id}
                className="group relative p-3 transition-all duration-200 hover:opacity-90"
                style={{
                  background: colors.bg,
                  border: `2px solid ${colors.border}`,
                  borderRadius: '12px 4px 12px 4px',
                }}
              >
                <p 
                  className="text-sm pr-6 whitespace-pre-wrap"
                  style={{ color: colors.text }}
                >
                  {note.content}
                </p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="absolute top-2 right-2 w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/20"
                  style={{ background: 'rgba(0,0,0,0.1)' }}
                >
                  <X className="w-3 h-3" style={{ color: colors.border }} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
