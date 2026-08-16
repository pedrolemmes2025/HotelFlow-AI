import React, { useState } from 'react';
import { TrendingUp, MessageSquare, Globe, Building, Sparkles, DollarSign } from 'lucide-react';
import { DashboardMetrics } from '../../types';

interface OccupancyRevenueChartProps {
  metrics: DashboardMetrics;
}

export const OccupancyRevenueChart: React.FC<OccupancyRevenueChartProps> = ({ metrics }) => {
  const [activeTab, setActiveTab] = useState<'OCCUPANCY' | 'CHANNELS'>('OCCUPANCY');

  const days = [
    { day: 'Seg', rate: 68, label: '68%' },
    { day: 'Ter', rate: 74, label: '74%' },
    { day: 'Qua', rate: 82, label: '82%' },
    { day: 'Qui', rate: 85, label: '85%' },
    { day: 'Sex', rate: 94, label: '94%' },
    { day: 'Sáb', rate: 98, label: '98%' },
    { day: 'Dom', rate: 86, label: '86%' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Desempenho & Canais de Venda</h3>
          <p className="text-xs text-slate-500 mt-0.5">Taxa de ocupação semanal e impacto da IA</p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('OCCUPANCY')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'OCCUPANCY'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ocupação
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CHANNELS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'CHANNELS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Canais de Venda
          </button>
        </div>
      </div>

      {activeTab === 'OCCUPANCY' ? (
        <div className="space-y-4">
          {/* Visual Bar Chart */}
          <div className="grid grid-cols-7 gap-2 items-end h-36 pt-4 border-b border-slate-100 pb-2">
            {days.map((item, idx) => {
              const isToday = idx === 6;
              return (
                <div key={item.day} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                  <div className="w-full max-w-[36px] bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                    <div
                      className={`w-full transition-all duration-700 rounded-t-lg ${
                        isToday
                          ? 'bg-[#b88e2f] group-hover:bg-[#a37c26]'
                          : 'bg-slate-800 group-hover:bg-slate-950'
                      }`}
                      style={{ height: `${item.rate}%` }}
                    />
                  </div>
                  <span className={`text-[11px] font-semibold ${isToday ? 'text-[#b88e2f]' : 'text-slate-500'}`}>
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-3 text-center pt-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Diária Média (ADR)</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">R$ 645,00</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">RevPAR</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">R$ 554,70</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-600">Recuperado por IA</span>
              <p className="text-sm font-bold mt-0.5">+R$ 8.640</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 py-2">
          {/* Channels Progress */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp + IA Atendente (Zero Comissão)
                </span>
                <span className="font-bold text-slate-900">44% (R$ 19.880)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[44%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-blue-700">
                  <Globe className="w-3.5 h-3.5" /> Site / Motor Direto
                </span>
                <span className="font-bold text-slate-900">36% (R$ 16.272)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-[36%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Building className="w-3.5 h-3.5" /> OTAs (Booking, Airbnb)
                </span>
                <span className="font-bold text-slate-900">20% (R$ 9.040)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full w-[20%]" />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#b88e2f]" />
              <span>Economia gerada em comissões de OTAs este mês:</span>
            </div>
            <span className="font-bold text-[#b88e2f]">R$ 4.380,00</span>
          </div>
        </div>
      )}
    </div>
  );
};
