import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, Check, Sparkles, Building2, HelpCircle } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LoginPageProps {
  onGoToLanding: () => void;
  onOpenOnboarding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onGoToLanding, onOpenOnboarding }) => {
  const { login, quickLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('admin@grandplaza.com');
  const [password, setPassword] = useState('••••••••');
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = await login(email, password);
    if (!success) {
      setErrorMsg('Credenciais não encontradas. Tente um dos logins rápidos de demonstração abaixo.');
    }
  };

  const handleQuick = (role: UserRole) => {
    quickLogin(role);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-900 overflow-x-hidden font-sans">
      {/* Subtle Luxury Hotel Architecture Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&auto=format&fit=crop&q=80')`
        }}
      />

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={onGoToLanding} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo size="sm" />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToLanding}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg transition-colors"
          >
            Landing Page Comercial
          </button>
          <button
            onClick={onOpenOnboarding}
            className="text-xs font-semibold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-sm transition-all"
          >
            + Cadastrar Hotel
          </button>
        </div>
      </header>

      {/* Main Center Login Card - Matching Image 10 */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden backdrop-blur-sm">
          <div className="p-8 sm:p-10">
            {/* Logo in top center */}
            <div className="flex justify-center mb-6">
              <Logo size="lg" showText={false} />
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
              <p className="text-sm text-slate-500 mt-1">Sign in to manage your property</p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@grandplaza.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                </div>
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-medium text-[#b88e2f] hover:text-[#977323] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-[#0B132B] hover:bg-[#1C2541] text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-70"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              Need an account?{' '}
              <button
                onClick={onOpenOnboarding}
                className="font-semibold text-[#b88e2f] hover:underline"
              >
                Contact Sales
              </button>
            </div>
          </div>

          {/* Quick Demo Switcher Bar */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#b88e2f]" /> Perfis de Demonstração:
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@grandplaza.com');
                  handleQuick('HOTEL_ADMIN');
                }}
                className="px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-medium text-slate-700 text-center transition-all truncate"
                title="Administrador do Hotel"
              >
                👑 Hotel Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('manager@grandplaza.com');
                  handleQuick('MANAGER');
                }}
                className="px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-medium text-slate-700 text-center transition-all truncate"
                title="Gerente de Operações"
              >
                💼 Gerente
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('reception@grandplaza.com');
                  handleQuick('RECEPTIONIST');
                }}
                className="px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-medium text-slate-700 text-center transition-all truncate"
                title="Recepção"
              >
                🛎️ Recepção
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('staff@grandplaza.com');
                  handleQuick('STAFF');
                }}
                className="px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-medium text-slate-700 text-center transition-all truncate"
                title="Funcionário / Governança"
              >
                🧹 Equipe
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('superadmin@hotelflow.ai');
                  handleQuick('SUPER_ADMIN');
                }}
                className="col-span-2 px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-center transition-all truncate"
                title="Super Admin da Plataforma"
              >
                🌐 Super Admin (SaaS)
              </button>
            </div>
          </div>

          {/* Bottom Security Banner - Exact match of Image 10 */}
          <div className="py-3 bg-slate-100/80 border-t border-slate-200 flex items-center justify-center gap-1.5 text-xs text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span>Enterprise Grade Security</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>© 2024 HotelFlow AI. All rights reserved.</span>
        <div className="flex items-center gap-6">
          <span className="hover:text-slate-700 cursor-pointer">Privacy</span>
          <span className="hover:text-slate-700 cursor-pointer">Terms</span>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Recuperação de Senha</h3>
            <p className="text-xs text-slate-500 mb-4">
              Informe seu e-mail para receber um link seguro de redefinição de acesso.
            </p>

            {forgotSent ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-sm flex items-center gap-2 mb-4">
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Link de recuperação enviado com sucesso para <strong>{forgotEmail}</strong>.</span>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="seu-email@hotel.com"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm"
                />
                <button
                  onClick={() => setForgotSent(true)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all"
                >
                  Enviar Instruções
                </button>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSent(false);
                }}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
