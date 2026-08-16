import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Image as ImageIcon,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Coffee,
  Car,
  ShieldCheck,
  BedDouble,
  DollarSign,
  Sparkles,
  Bot,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { db } from '../../lib/db';
import { Hotel } from '../../types';

interface OnboardingWizardProps {
  onComplete: (newHotel: Hotel) => void;
  onCancel: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State across 14 steps
  const [formData, setFormData] = useState({
    name: 'Pousada Solar das Dunas',
    logo: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=150&auto=format&fit=crop&q=80',
    street: 'Rua das Gaivotas',
    number: '120',
    neighborhood: 'Centro',
    city: 'Jericoacoara',
    state: 'CE',
    zipCode: '62598-000',
    country: 'Brasil',
    phone: '+55 (88) 3669-1234',
    whatsapp: '+55 (88) 98877-6655',
    email: 'contato@solardasdunas.com.br',
    checkInTime: '14:00',
    checkOutTime: '11:30',
    breakfastIncluded: true,
    breakfastPrice: 0,
    breakfastHours: '07:00 - 10:30',
    breakfastLocation: 'Deck Panorâmico com vista para o pôr do sol',
    parkingAvailable: true,
    parkingValet: false,
    parkingPrice: 0,
    cancellationPolicy: 'Cancelamento gratuito até 5 dias antes da data de entrada.',
    petsAllowed: true,
    smokingAllowed: false,
    quietHours: '22:00 às 08:00',
    initialRoomsCount: 15,
    standardRoomPrice: 380,
    deluxeRoomPrice: 590,
    services: ['Café da Manhã', 'Transfer 4x4', 'Passeio de Buggy', 'Late Checkout'],
    aiPersonality: 'PREMIUM' as Hotel['aiPersonality'],
    planId: 'PRO' as Hotel['planId'],
  });

  const [isFinished, setIsFinished] = useState(false);

  const totalSteps = 14;

  const stepTitles = [
    'Nome do Hotel',
    'Logotipo & Identidade',
    'Endereço & Localização',
    'Telefone de Contato',
    'WhatsApp Business Oficial',
    'Horário de Check-in',
    'Horário de Check-out',
    'Café da Manhã',
    'Estacionamento',
    'Políticas & Regras',
    'Estrutura de Quartos',
    'Preços & Diárias Base',
    'Serviços Extras & Marketplace',
    'Personalidade da IA HotelFlow',
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Complete Onboarding
      const newHotel = db.createHotel({
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        logo: formData.logo,
        address: {
          street: formData.street,
          number: formData.number,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime,
        breakfast: {
          included: formData.breakfastIncluded,
          price: formData.breakfastPrice,
          hours: formData.breakfastHours,
          location: formData.breakfastLocation,
        },
        parking: {
          available: formData.parkingAvailable,
          valet: formData.parkingValet,
          pricePerDay: formData.parkingPrice,
        },
        policies: {
          cancellation: formData.cancellationPolicy,
          petsAllowed: formData.petsAllowed,
          smokingAllowed: formData.smokingAllowed,
          quietHours: formData.quietHours,
        },
        aiPersonality: formData.aiPersonality,
        planId: formData.planId,
        status: 'ACTIVE',
      });

      setIsFinished(true);
      setTimeout(() => {
        onComplete(newHotel);
      }, 1600);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <Logo size="sm" />
          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
            <span className="text-[#b88e2f]">Etapa {currentStep} de {totalSteps}</span>
            <span className="text-slate-700">{stepTitles[currentStep - 1]}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#b88e2f] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 md:p-8 min-h-[340px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {isFinished ? (
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Seu hotel está pronto!</h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  A IA HotelFlow já foi treinada com as políticas, quartos e horários de <strong>{formData.name}</strong>.
                  Acessando dashboard...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Step 1: Hotel Name */}
                {currentStep === 1 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Qual é o nome do seu estabelecimento?</h4>
                        <p className="text-xs text-slate-500">Nome oficial do hotel, pousada ou resort para hóspedes e documentos.</p>
                      </div>
                    </div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Nome Comercial</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900 font-medium"
                      placeholder="Ex: Pousada Villa Maré"
                    />
                  </div>
                )}

                {/* Step 2: Logo */}
                {currentStep === 2 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Logotipo do Hotel</h4>
                        <p className="text-xs text-slate-500">Usado no motor de reservas, vouchers e portal do hóspede.</p>
                      </div>
                    </div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">URL da Imagem ou Logo</label>
                    <input
                      type="text"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900 text-sm mb-3"
                    />
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <img src={formData.logo} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                      <span className="text-xs text-slate-500">Prévia do logotipo que seus clientes verão</span>
                    </div>
                  </div>
                )}

                {/* Step 3: Address */}
                {currentStep === 3 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Endereço Completo</h4>
                        <p className="text-xs text-slate-500">A IA utilizará esta localização para dar referências de trajeto aos hóspedes.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={formData.street}
                          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                          placeholder="Rua / Avenida"
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Cidade"
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          placeholder="Estado (UF)"
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Phone */}
                {currentStep === 4 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Telefone Principal</h4>
                        <p className="text-xs text-slate-500">Telefone fixo ou central de atendimento.</p>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 font-medium"
                      placeholder="+55 (11) 3000-0000"
                    />
                  </div>
                )}

                {/* Step 5: WhatsApp */}
                {currentStep === 5 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">WhatsApp Business do Hotel</h4>
                        <p className="text-xs text-slate-500">Canal onde a IA HotelFlow atenderá 24 horas por dia e fechará reservas.</p>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 font-medium text-lg"
                      placeholder="+55 (11) 99999-9999"
                    />
                  </div>
                )}

                {/* Step 6: Check-in Time */}
                {currentStep === 6 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Horário Oficial de Check-in</h4>
                        <p className="text-xs text-slate-500">Horário padrão em que os quartos são liberados.</p>
                      </div>
                    </div>
                    <input
                      type="time"
                      value={formData.checkInTime}
                      onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                      className="px-4 py-3 border border-slate-200 rounded-xl text-xl font-bold text-slate-900"
                    />
                  </div>
                )}

                {/* Step 7: Check-out Time */}
                {currentStep === 7 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Horário Oficial de Check-out</h4>
                        <p className="text-xs text-slate-500">Horário limite de desocupação do quarto.</p>
                      </div>
                    </div>
                    <input
                      type="time"
                      value={formData.checkOutTime}
                      onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                      className="px-4 py-3 border border-slate-200 rounded-xl text-xl font-bold text-slate-900"
                    />
                  </div>
                )}

                {/* Step 8: Breakfast */}
                {currentStep === 8 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                        <Coffee className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Informações do Café da Manhã</h4>
                        <p className="text-xs text-slate-500">Detalhes para orientar hóspedes e responder dúvidas com precisão.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <input
                          type="checkbox"
                          checked={formData.breakfastIncluded}
                          onChange={(e) => setFormData({ ...formData, breakfastIncluded: e.target.checked })}
                          className="w-4 h-4 rounded text-slate-900"
                        />
                        Café da Manhã incluso nas diárias
                      </label>
                      <input
                        type="text"
                        value={formData.breakfastHours}
                        onChange={(e) => setFormData({ ...formData, breakfastHours: e.target.value })}
                        placeholder="Horário (ex: 06:30 às 10:00)"
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                      />
                      <input
                        type="text"
                        value={formData.breakfastLocation}
                        onChange={(e) => setFormData({ ...formData, breakfastLocation: e.target.value })}
                        placeholder="Local (ex: Restaurante Térreo)"
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Step 9: Parking */}
                {currentStep === 9 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Estacionamento</h4>
                        <p className="text-xs text-slate-500">Configuração de vagas para hóspedes.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <input
                          type="checkbox"
                          checked={formData.parkingAvailable}
                          onChange={(e) => setFormData({ ...formData, parkingAvailable: e.target.checked })}
                          className="w-4 h-4 rounded text-slate-900"
                        />
                        Estacionamento disponível no local
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 10: Policies */}
                {currentStep === 10 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Políticas do Hotel</h4>
                        <p className="text-xs text-slate-500">Regras de cancelamento, animais de estimação e silêncio.</p>
                      </div>
                    </div>
                    <textarea
                      value={formData.cancellationPolicy}
                      onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                      rows={3}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                )}

                {/* Step 11: Rooms */}
                {currentStep === 11 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <BedDouble className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Capacidade & Quantidade de Quartos</h4>
                        <p className="text-xs text-slate-500">Total de unidades habitacionais gerenciadas.</p>
                      </div>
                    </div>
                    <input
                      type="number"
                      value={formData.initialRoomsCount}
                      onChange={(e) => setFormData({ ...formData, initialRoomsCount: Number(e.target.value) })}
                      className="px-4 py-3 border border-slate-200 rounded-xl text-2xl font-bold w-32"
                    />
                  </div>
                )}

                {/* Step 12: Pricing */}
                {currentStep === 12 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Diária Base Inicial</h4>
                        <p className="text-xs text-slate-500">Preço padrão para cálculo de reservas e cotações da IA.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-slate-500">R$</span>
                      <input
                        type="number"
                        value={formData.standardRoomPrice}
                        onChange={(e) => setFormData({ ...formData, standardRoomPrice: Number(e.target.value) })}
                        className="px-4 py-3 border border-slate-200 rounded-xl text-2xl font-bold w-44"
                      />
                    </div>
                  </div>
                )}

                {/* Step 13: Extra Services */}
                {currentStep === 13 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Serviços Extras para Upsell</h4>
                        <p className="text-xs text-slate-500">Serviços adicionais sugeridos durante a estadia ou reserva.</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.services.map((srv, i) => (
                        <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 font-medium text-xs rounded-lg border border-purple-100">
                          ✓ {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 14: AI Personality */}
                {currentStep === 14 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-[#b88e2f] text-white flex items-center justify-center">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Tom de Voz da IA HotelFlow</h4>
                        <p className="text-xs text-slate-500">Como o assistente conversará no WhatsApp e no portal.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'PREMIUM', label: 'Premium & Sofisticado', desc: 'Linguagem elegante, acolhedora e exclusiva' },
                        { id: 'FRIENDLY', label: 'Amigável & Caloroso', desc: 'Tom descontraído, solícito e próximo' },
                        { id: 'FORMAL', label: 'Formal & Corporativo', desc: 'Estilo direto, respeitoso e corporativo' },
                        { id: 'OBJECTIVE', label: 'Objetivo & Rápido', desc: 'Focado em respostas curtas e conversão imediata' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, aiPersonality: item.id as any })}
                          className={`p-3.5 text-left rounded-xl border transition-all ${
                            formData.aiPersonality === item.id
                              ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                              : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-800'
                          }`}
                        >
                          <p className="font-bold text-sm">{item.label}</p>
                          <p className={`text-xs mt-1 ${formData.aiPersonality === item.id ? 'text-slate-300' : 'text-slate-500'}`}>
                            {item.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Actions */}
        {!isFinished && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={handlePrev}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentStep === 1
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-md transition-all active:scale-[0.98]"
            >
              {currentStep === totalSteps ? 'Concluir Cadastro' : 'Avançar'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
