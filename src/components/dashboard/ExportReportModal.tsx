import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle2, Calendar, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/db';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ isOpen, onClose }) => {
  const { currentHotel, user } = useAuth();
  const [format, setFormat] = useState<'PDF' | 'CSV'>('PDF');
  const [period, setPeriod] = useState('TODAY');
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  if (!isOpen || !currentHotel) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExported(true);

      if (user) {
        db.logAction({
          userId: user.id,
          userName: user.name,
          hotelId: currentHotel.id,
          action: 'REPORT_EXPORT',
          target: `Relatório Operacional (${format})`,
          details: `Exportação de dados do período ${period} por ${user.name}`,
        });
      }

      // Trigger synthetic download simulation
      const element = document.createElement('a');
      const file = new Blob([
        `HOTELFLOW AI - RELATORIO OPERACIONAL\nHotel: ${currentHotel.name}\nData: ${new Date().toLocaleDateString()}\nOcupacao: 86%\nReceita Hoje: R$ 45.200,00\nCheck-ins: 28\nCheck-outs: 15\n`
      ], { type: format === 'CSV' ? 'text/csv' : 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `hotelflow-relatorio-${currentHotel.slug}-${new Date().toISOString().substring(0, 10)}.${format.toLowerCase()}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Exportar Relatório</h3>
              <p className="text-xs text-slate-500">{currentHotel.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {exported ? (
            <div className="text-center py-4 space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-900">Relatório baixado com sucesso!</h4>
              <p className="text-xs text-slate-500">
                O arquivo foi gerado e salvo em seu dispositivo com todas as métricas consolidadas.
              </p>
              <button
                onClick={() => {
                  setExported(false);
                  onClose();
                }}
                className="mt-4 px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
              >
                Concluir
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Período de Dados</label>
                <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                  {[
                    { id: 'TODAY', label: 'Hoje' },
                    { id: 'THIS_WEEK', label: 'Esta Semana' },
                    { id: 'THIS_MONTH', label: 'Este Mês' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPeriod(p.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        period === p.id
                          ? 'border-slate-900 bg-slate-900 text-white font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Formato de Saída</label>
                <div className="grid grid-cols-2 gap-3 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setFormat('PDF')}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                      format === 'PDF'
                        ? 'border-slate-900 bg-slate-900 text-white font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-red-400" />
                    <span>Relatório Executivo PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('CSV')}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                      format === 'CSV'
                        ? 'border-slate-900 bg-slate-900 text-white font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    <span>Planilha CSV / Excel</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Inclui no documento:</p>
                <p>• Taxas de ocupação e diária média (ADR)</p>
                <p>• Relação de chegadas, partidas e quartos ocupados</p>
                <p>• Conversões de IA no WhatsApp vs Canais diretos</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleExport}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExporting ? 'Gerando...' : 'Gerar e Baixar'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
