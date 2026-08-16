import React from 'react';
import { Building2, Users, DollarSign, Bot, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/db';

interface SuperAdminDashboardProps {
  onOpenOnboarding: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onOpenOnboarding }) => {
  const { availableHotels, switchHotel } = useAuth();

  return (
    <div className="space-y-6">
      {/* Super Admin Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-[#0B132B] to-slate-900 text-white rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b88e2f]/20 border border-[#b88e2f]/40 text-xs font-bold text-[#b88e2f] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PAINEL GLOBAL SUPER ADMIN SAAS</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Visão Geral da Rede HotelFlow AI</h2>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie todas as propriedades hoteleiras, planos ativos, métricas de MRR e consumo global da IA.
          </p>
        </div>

        <button
          onClick={onOpenOnboarding}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#b88e2f] hover:bg-[#a67c24] text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Hotel</span>
        </button>
      </div>

      {/* Global SaaS Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Hotéis Ativos</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{availableHotels.length}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">100% em operação normal</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>MRR da Plataforma</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">R$ 48.900</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">+18% este mês</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Mensagens WhatsApp IA</span>
            <Bot className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">128.450</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Latência média: 1.1s</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Taxa Média de Conversão</span>
            <Users className="w-4 h-4 text-[#b88e2f]" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">34.8%</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Atendimentos → Reservas Pagas</p>
        </div>
      </div>

      {/* List of Registered Properties / Tenants */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Propriedades Conectadas (Tenants)</h3>
            <p className="text-xs text-slate-500">Isole o contexto ou acesse o painel individual de cada hotel</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {availableHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={hotel.logo}
                  alt={hotel.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-base">{hotel.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {hotel.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
                      PLANO {hotel.planId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {hotel.address.city}, {hotel.address.state} • WhatsApp: {hotel.whatsapp} • Check-in: {hotel.checkInTime}
                  </p>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                    <span>Slug: <code>{hotel.slug}</code></span>
                    <span>Tom IA: <strong>{hotel.aiPersonality}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => switchHotel(hotel.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
                >
                  <span>Entrar no Painel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
