import React from 'react';
import { Calendar, ArrowLeftRight, Bed, DollarSign, TrendingUp, Sparkles } from 'lucide-react';

interface StatCardProps {
  type: 'reservations' | 'checkins' | 'occupancy' | 'revenue';
  title?: string;
  data: any;
}

export const StatCard: React.FC<StatCardProps> = ({ type, data }) => {
  if (type === 'reservations') {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            TODAY'S RESERVATIONS
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            {data.todayReservations || 42}
          </span>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
            +{data.todayReservationsGrowth || 12}% <span className="text-slate-500 font-normal">vs yesterday</span>
          </span>
        </div>
      </div>
    );
  }

  if (type === 'checkins') {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            CHECK-INS / OUTS
          </span>
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-bold text-slate-900">
                {data.todayCheckIns?.completed || 28}
              </span>
              <span className="text-xs font-semibold text-slate-500">In</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-bold text-slate-900">
                {data.todayCheckOuts?.completed || 15}
              </span>
              <span className="text-xs font-semibold text-slate-500">Out</span>
            </div>
          </div>
          
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-slate-900 h-full w-[70%] rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'occupancy') {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            OCCUPANCY
          </span>
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
            <Bed className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
              {data.occupancyRate || 86}%
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              +{data.occupancyGrowthWoW || 4}% <span className="text-slate-500 font-normal">WoW</span>
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden flex">
            <div
              className="bg-slate-900 h-full rounded-full transition-all duration-500"
              style={{ width: `${data.occupancyRate || 86}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
            {data.availableRooms || 14} quartos livres para venda hoje
          </p>
        </div>
      </div>
    );
  }

  // Dark Revenue Card - Matching Image 1 & 7
  return (
    <div className="bg-[#0B132B] text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between relative overflow-hidden border border-slate-800">
      <div className="flex items-start justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          REVENUE (BRL)
        </span>
        <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/15">
          <DollarSign className="w-5 h-5 text-[#b88e2f]" />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-baseline gap-1">
          <span className="text-xl font-medium text-slate-300">R$</span>
          <span>45.2k</span>
        </div>
        <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>↑ +5.4%</span>
          <span className="text-slate-400 font-normal ml-1">Projetado: R$ 52k</span>
        </p>
      </div>
    </div>
  );
};
