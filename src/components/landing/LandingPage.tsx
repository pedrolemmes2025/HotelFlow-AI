import React, { useState } from 'react';
import {
  ArrowRight,
  Bot,
  MessageSquare,
  Sparkles,
  CalendarCheck,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  Zap,
  Check,
  ChevronDown,
  Building,
  Star,
  Users,
  Clock,
  Layers,
} from 'lucide-react';
import { Logo } from '../common/Logo';

interface LandingPageProps {
  onGoToLogin: () => void;
  onOpenOnboarding: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin, onOpenOnboarding }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [demoRequested, setDemoRequested] = useState(false);
  const [demoEmail, setDemoEmail] = useState('');

  const faqs = [
    {
      q: 'Como a IA do HotelFlow atende no WhatsApp?',
      a: 'A IA é conectada à API oficial do WhatsApp e consulta o banco de dados do seu hotel em tempo real. Ela sabe exatamente quais quartos estão disponíveis, os preços, horários de café, políticas e pode até gerar links de pagamento PIX para confirmar a reserva instantaneamente.',
    },
    {
      q: 'Preciso trocar o software que já utilizo no hotel?',
      a: 'Não necessariamente. O HotelFlow AI foi construído com adaptadores modulares para integrar com os principais PMSs e Channel Managers do mercado ou ser utilizado como seu sistema operacional completo.',
    },
    {
      q: 'Como funciona a recuperação de reservas abandonadas?',
      a: 'Quando um visitante entra no motor de reservas ou inicia uma cotação no WhatsApp e não conclui, o sistema registra o lead e dispara uma mensagem automatizada personalizada para tirar dúvidas e fechar a estadia.',
    },
    {
      q: 'Posso personalizar as políticas e a personalidade da IA?',
      a: 'Sim! No onboarding e nas configurações, você define o tom de voz (Formal, Amigável, Premium ou Objetivo), regras de cancelamento, horário de café, estacionamento e serviços extras.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#b88e2f]/20 selection:text-slate-900">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#solucoes" className="hover:text-slate-950 transition-colors">Soluções</a>
            <a href="#recursos" className="hover:text-slate-950 transition-colors">Recursos</a>
            <a href="#ia-whatsapp" className="hover:text-slate-950 transition-colors">WhatsApp + IA</a>
            <a href="#planos" className="hover:text-slate-950 transition-colors">Planos</a>
            <a href="#faq" className="hover:text-slate-950 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl transition-colors"
            >
              Acessar Painel
            </button>
            <button
              onClick={onOpenOnboarding}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0B132B] hover:bg-[#1C2541] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all active:scale-98"
            >
              <span>Começar Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION - Matching Image 3 */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copywriting */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-[#b88e2f]" />
              <span>SaaS Operacional & IA para Hotelaria de Alto Padrão</span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-slate-950 leading-[1.15]">
              Transforme o atendimento do seu hotel com automação e inteligência artificial.
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Atenda hóspedes, gerencie reservas e aumente suas vendas em uma única plataforma projetada para a excelência na hospitalidade.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('demo-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-2.5 px-7 py-4 bg-[#0B132B] hover:bg-[#1C2541] text-white text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-98"
              >
                <span>Solicitar demonstração</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onGoToLogin}
                className="flex items-center justify-center px-7 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-base font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-xs"
              >
                Conhecer os recursos
              </button>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-6 border-t border-slate-100 flex items-center gap-8 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Multi-tenant Isolado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Respostas IA em 1.2s</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[#b88e2f] fill-[#b88e2f]" />
                <span>99.9% Disponibilidade</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Frame matching Image 3 */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl p-2 bg-gradient-to-b from-slate-200 to-slate-100 shadow-2xl border border-slate-200">
              {/* Window dots */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 rounded-t-xl border-b border-slate-200">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-medium text-slate-400 ml-2">hotelflow.ai/app/dashboard</span>
              </div>

              {/* Computer Display Image / Live Mockup Preview */}
              <div className="relative rounded-b-xl overflow-hidden bg-slate-900 aspect-video group cursor-pointer" onClick={onGoToLogin}>
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80"
                  alt="Hotel Reception Luxury"
                  className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Preview Card Overlay */}
                <div className="absolute inset-4 bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-2xl border border-white/50 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <Logo size="sm" />
                      <span className="text-xs font-semibold text-slate-700">Grand Plaza Branch</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Ao Vivo
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 my-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ocupação Hoje</p>
                      <p className="text-xl font-bold text-slate-900">86%</p>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-slate-900 h-full w-[86%]" />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Check-ins</p>
                      <p className="text-xl font-bold text-slate-900">28 <span className="text-xs font-normal text-slate-500">/ 15 Out</span></p>
                    </div>

                    <div className="p-3 bg-slate-900 text-white rounded-lg">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Receita Hoje</p>
                      <p className="text-xl font-bold text-white">R$ 45.2k</p>
                      <p className="text-[10px] text-emerald-400 mt-1">↑ +5.4% vs meta</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-[#b88e2f]" />
                      <span><strong>38 conversas</strong> em andamento com IA no WhatsApp</span>
                    </div>
                    <span className="text-[#b88e2f] font-bold">Ver Painel →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM & SOLUTION SECTION */}
      <section id="solucoes" className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-[#b88e2f] uppercase mb-2">
              Da Recepção ao Pós-Estadia
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-950">
              O fluxo completo para sua propriedade faturar mais com menos esforço
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">WhatsApp + IA Atendente</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Chega de perder clientes por demorar 20 minutos para responder uma cotação. A IA consulta o banco de dados em tempo real e envia fotos, disponibilidade e link de pagamento na hora.
              </p>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                +40% de conversão direta
              </span>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Portal "Minha Estadia"</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                O hóspede acessa um webapp mobile com chave digital, solicitação de toalhas extras, room service, late checkout e pré-check-in sem precisar instalar nada na loja de apps.
              </p>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                Experiência 5 Estrelas
              </span>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">CRM & Recuperação de Carrinho</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Visitantes que iniciaram reserva mas não concluíram são reengajados automaticamente pela IA. Crie campanhas de remarketing para hóspedes antigos e datas comemorativas.
              </p>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                Zero comissões abusivas
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PLANS SECTION */}
      <section id="planos" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-[#b88e2f] uppercase mb-2">Planos Transparentes</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-950">
              Estruturado para crescer com o seu hotel
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Starter */}
            <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900">STARTER</h4>
                <p className="text-xs text-slate-500 mt-1">Para pousadas e pequenos hotéis boutique</p>
                <div className="my-6">
                  <span className="text-4xl font-bold text-slate-900">R$ 290</span>
                  <span className="text-slate-500 text-sm"> / mês</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Dashboard & Calendário
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Até 15 quartos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Motor de Reservas Direto
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Gestão de Hóspedes
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenOnboarding}
                className="w-full mt-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-sm transition-all"
              >
                Escolher Starter
              </button>
            </div>

            {/* Pro - Featured */}
            <div className="p-8 bg-slate-900 text-white rounded-2xl shadow-xl border-2 border-[#b88e2f] relative flex flex-col justify-between">
              <div className="absolute -top-3.5 right-6 bg-[#b88e2f] text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Mais Escolhido
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">PRO</h4>
                <p className="text-xs text-slate-400 mt-1">Para hotéis que buscam automação e vendas 24/7</p>
                <div className="my-6">
                  <span className="text-4xl font-bold text-white">R$ 690</span>
                  <span className="text-slate-400 text-sm"> / mês</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#b88e2f]" /> Tudo do Plano Starter
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#b88e2f]" /> WhatsApp Business + Atendente IA
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#b88e2f]" /> Portal "Minha Estadia" Mobile
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#b88e2f]" /> Central de Tarefas & Solicitações
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#b88e2f]" /> Automações de Check-in e Pré-estadia
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenOnboarding}
                className="w-full mt-8 py-3 bg-[#b88e2f] hover:bg-[#a67c24] text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md"
              >
                Testar Grátis por 14 Dias
              </button>
            </div>

            {/* Premium */}
            <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900">PREMIUM</h4>
                <p className="text-xs text-slate-500 mt-1">Para resorts, redes e propriedades de grande porte</p>
                <div className="my-6">
                  <span className="text-4xl font-bold text-slate-900">R$ 1.290</span>
                  <span className="text-slate-500 text-sm"> / mês</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Tudo do Plano Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Quartos Ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Recuperador Ativo de Reservas Abandonadas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Campanhas de Marketing & Segmentação VIP
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Relatórios Comerciais & Integração PMS
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenOnboarding}
                className="w-full mt-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all"
              >
                Falar com Consultor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold tracking-widest text-[#b88e2f] uppercase mb-2">Dúvidas Frequentes</h2>
            <h3 className="text-3xl font-bold text-slate-950">Perguntas comuns sobre o HotelFlow AI</h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between font-semibold text-slate-900 text-base"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-slate-900' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="demo-section" className="py-20 bg-[#0B132B] text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Pronto para colocar a IA do HotelFlow no seu estabelecimento?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8 text-base">
            Configure seu hotel em menos de 5 minutos através do nosso onboarding guiado ou solicite uma demonstração exclusiva.
          </p>

          {demoRequested ? (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 max-w-md mx-auto text-sm">
              ✓ Solicitação enviada! Nossa equipe de especialistas entrará em contato em instantes.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDemoRequested(true);
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={demoEmail}
                onChange={(e) => setDemoEmail(e.target.value)}
                placeholder="seu-email@hotel.com.br"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b88e2f] text-sm"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-[#b88e2f] hover:bg-[#a67c24] text-slate-950 font-bold rounded-xl text-sm transition-all whitespace-nowrap"
              >
                Solicitar Demonstração
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER - Matching Image 3 */}
      <footer className="w-full bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">HotelFlow AI</span>
            <span>© 2024 HotelFlow AI. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-slate-800 cursor-pointer">System Health</span>
            <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-800 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-800 cursor-pointer">API Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
