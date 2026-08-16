import React, { useState } from 'react';
import { CheckCircle, Clock, ChevronRight, UserCheck, Sparkles, Bed } from 'lucide-react';
import { Reservation } from '../../types';
import { db } from '../../lib/db';
import { useAuth } from '../../context/AuthContext';

interface ArrivalsTableProps {
  reservations: Reservation[];
  onRefresh: () => void;
  onViewAll?: () => void;
}

export const ArrivalsTable: React.FC<ArrivalsTableProps> = ({
  reservations,
  onRefresh,
  onViewAll,
}) => {
  const { user, currentHotel } = useAuth();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleCheckIn = (res: Reservation) => {
    setProcessingId(res.id);
    setTimeout(() => {
      db.updateReservationStatus(res.id, 'CHECKED_IN');
      if (user && currentHotel) {
        db.logAction({
          userId: user.id,
          userName: user.name,
          hotelId: currentHotel.id,
          action: 'GUEST_CHECK_IN',
          target: `${res.guestName} (${res.code})`,
          details: `Check-in realizado com sucesso no quarto ${res.roomNumber || res.roomTypeName}`,
        });
      }
      setProcessingId(null);
      onRefresh();
    }, 400);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Header matching Image 1 */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Today's Arrivals</h3>
          <p className="text-xs text-slate-500 mt-0.5">Hóspedes com chegada prevista ou confirmada hoje</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-[#b88e2f] hover:text-[#977323] flex items-center gap-0.5 transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-6">GUEST</th>
              <th className="py-3 px-4">ROOM</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4">ETA</th>
              <th className="py-3 px-6 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                  Nenhuma chegada agendada para hoje.
                </td>
              </tr>
            ) : (
              reservations.slice(0, 5).map((res) => {
                const isCheckedIn = res.status === 'CHECKED_IN';
                return (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Guest Avatar & Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200 uppercase flex-shrink-0">
                          {res.guestName.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{res.guestName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                            <span>{res.code}</span>
                            {res.channel === 'WHATSAPP_AI' && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                                via WhatsApp IA
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Room */}
                    <td className="py-4 px-4">
                      <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        <span>{res.roomTypeName}</span>
                        {res.roomNumber && (
                          <span className="text-slate-500 font-normal">({res.roomNumber})</span>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      {isCheckedIn ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Checked In
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Pending
                        </span>
                      )}
                    </td>

                    {/* ETA */}
                    <td className="py-4 px-4 text-xs font-medium text-slate-600">
                      {isCheckedIn ? (
                        <span className="text-slate-500">Arrived</span>
                      ) : (
                        <span>{res.eta || '14:00'}</span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-6 text-right">
                      {isCheckedIn ? (
                        <span className="text-xs font-medium text-emerald-700 flex items-center justify-end gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Hospedado
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={processingId === res.id}
                          onClick={() => handleCheckIn(res)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow transition-all active:scale-95 disabled:opacity-50"
                        >
                          {processingId === res.id ? 'Entrando...' : 'Fazer Check-In'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
