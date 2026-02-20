'use client';

import { useState, useEffect } from 'react';
import { Shield, Check, X, Clock, AlertTriangle, Send } from 'lucide-react';

interface Approval {
  id: string;
  type: string;
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
}

const typeLabels: Record<string, string> = {
  deploy: 'Deploy',
  delete: 'Exclusão',
  external: 'Ação Externa',
  config: 'Configuração',
  financial: 'Financeiro'
};

const typeColors: Record<string, string> = {
  deploy: 'bg-blue-100 text-blue-800',
  delete: 'bg-red-100 text-red-800',
  external: 'bg-purple-100 text-purple-800',
  config: 'bg-yellow-100 text-yellow-800',
  financial: 'bg-green-100 text-green-800'
};

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newApproval, setNewApproval] = useState({
    type: 'config',
    title: '',
    description: '',
    requestedBy: 'Liliana'
  });

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const res = await fetch('/api/approvals');
      const data = await res.json();
      setApprovals(data.approvals || []);
    } catch (error) {
      console.error('Error fetching approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApproval)
      });
      setShowForm(false);
      setNewApproval({ type: 'config', title: '', description: '', requestedBy: 'Liliana' });
      fetchApprovals();
    } catch (error) {
      console.error('Error creating approval:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await fetch('/api/approvals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved', approvedBy: 'Gilmar' })
      });
      fetchApprovals();
    } catch (error) {
      console.error('Error approving:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch('/api/approvals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'rejected', approvedBy: 'Gilmar' })
      });
      fetchApprovals();
    } catch (error) {
      console.error('Error rejecting:', error);
    }
  };

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const processedApprovals = approvals.filter(a => a.status !== 'pending');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold">Aprovações</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Send className="w-4 h-4" />
          Nova Solicitação
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Nova Solicitação de Aprovação</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                value={newApproval.type}
                onChange={e => setNewApproval({ ...newApproval, type: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="config">Configuração</option>
                <option value="deploy">Deploy</option>
                <option value="delete">Exclusão</option>
                <option value="external">Ação Externa</option>
                <option value="financial">Financeiro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                type="text"
                value={newApproval.title}
                onChange={e => setNewApproval({ ...newApproval, title: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <textarea
                value={newApproval.description}
                onChange={e => setNewApproval({ ...newApproval, description: e.target.value })}
                className="w-full p-2 border rounded-lg"
                rows={3}
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">
                Enviar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pending Approvals */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-600" />
          Pendentes ({pendingApprovals.length})
        </h2>
        {pendingApprovals.length === 0 ? (
          <p className="text-gray-500">Nenhuma aprovação pendente</p>
        ) : (
          <div className="space-y-3">
            {pendingApprovals.map(approval => (
              <div key={approval.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-400">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs ${typeColors[approval.type]}`}>
                        {typeLabels[approval.type]}
                      </span>
                      <span className="text-sm text-gray-500">
                        Por {approval.requestedBy} • {new Date(approval.requestedAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <h3 className="font-semibold">{approval.title}</h3>
                    <p className="text-sm text-gray-600">{approval.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(approval.id)}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                      title="Aprovar"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleReject(approval.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      title="Rejeitar"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Processed Approvals */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Histórico</h2>
        {processedApprovals.length === 0 ? (
          <p className="text-gray-500">Nenhuma aprovação processada</p>
        ) : (
          <div className="space-y-3">
            {processedApprovals.map(approval => (
              <div
                key={approval.id}
                className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                  approval.status === 'approved' ? 'border-green-400' : 'border-red-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs ${typeColors[approval.type]}`}>
                        {typeLabels[approval.type]}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        approval.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {approval.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                      </span>
                    </div>
                    <h3 className="font-semibold">{approval.title}</h3>
                    <p className="text-sm text-gray-600">{approval.description}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>Por {approval.approvedBy}</p>
                    <p>{approval.approvedAt ? new Date(approval.approvedAt).toLocaleString('pt-BR') : ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
