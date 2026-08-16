import React from 'react';
import { X, Shield, Clock, User, ArrowRight, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/db';

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({ isOpen, onClose }) => {
  const { currentHotel, user } = useAuth();
  const logs = currentHotel ? db.getAuditLogs(currentHotel.id) : db.getAuditLogs();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Trilha de Auditoria</h3>
              <p className="text-xs text-slate-500">Registro de ações do sistema e segurança</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Audit Logs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              Nenhum log registrado ainda.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#b88e2f]" />
                    {log.action}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {log.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-medium">
                  {log.target}
                </p>

                {log.details && (
                  <p className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                    {log.details}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {log.userName}
                  </span>
                  <span>IP: 192.168.1.1</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-400 text-center">
          Logs criptografados e imutáveis com retenção de conformidade.
        </div>
      </div>
    </div>
  );
};
