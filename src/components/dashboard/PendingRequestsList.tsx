import React, { useState } from 'react';
import { Sparkles, Wrench, Utensils, CheckCircle, Clock, ChevronRight, Check } from 'lucide-react';
import { ServiceRequest } from '../../types';
import { db } from '../../lib/db';
import { useAuth } from '../../context/AuthContext';

interface PendingRequestsListProps {
  requests: ServiceRequest[];
  onRefresh: () => void;
  onViewAll?: () => void;
}

export const PendingRequestsList: React.FC<PendingRequestsListProps> = ({
  requests,
  onRefresh,
  onViewAll,
}) => {
  const { user, currentHotel } = useAuth();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('PENDING');

  const handleStatusChange = (id: string, status: ServiceRequest['status']) => {
    db.updateServiceRequestStatus(id, status, user?.name || 'Equipe');
    if (user && currentHotel) {
      db.logAction({
        userId: user.id,
        userName: user.name,
        hotelId: currentHotel.id,
        action: 'SERVICE_REQUEST_UPDATE',
        target: `Solicitação ${id}`,
        details: `Status alterado para ${status} por ${user.name}`,
      });
    }
    onRefresh();
  };

  const getIcon = (type: ServiceRequest['type']) => {
    switch (type) {
      case 'TOWELS':
      case 'CLEANING':
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        );
      case 'MAINTENANCE':
        return (
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center flex-shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
        );
      case 'ROOM_SERVICE':
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
        );
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between">
      {/* Top Title & Count Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900">Pending Requests</h3>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {pendingCount} New
            </span>
          )}
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-[#b88e2f] hover:text-[#977323] flex items-center gap-0.5 transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Requests items list - Matching Image 1 & 7 */}
      <div className="space-y-3 flex-1">
        {requests.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Nenhuma solicitação pendente no momento.
          </div>
        ) : (
          requests.slice(0, 4).map((req) => {
            const isCompleted = req.status === 'COMPLETED';
            return (
              <div
                key={req.id}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getIcon(req.type)}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {req.title} - Quarto {req.roomNumber}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{req.requestedAt}</span>
                      <span className="text-slate-300">•</span>
                      <span className="truncate">{req.guestName}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Button */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {req.status === 'PENDING' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(req.id, 'IN_PROGRESS')}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-all"
                    >
                      Atender
                    </button>
                  )}
                  {req.status === 'IN_PROGRESS' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(req.id, 'COMPLETED')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-all flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Concluir
                    </button>
                  )}
                  {isCompleted && (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Concluído
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer hint */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Respostas da equipe integradas com portal do hóspede</span>
        <span className="font-medium text-slate-600">Tempo médio: 4.2 min</span>
      </div>
    </div>
  );
};
