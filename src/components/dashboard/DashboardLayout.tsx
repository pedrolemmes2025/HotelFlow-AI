import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarCheck2,
  BedDouble,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  Plus,
  FileDown,
  Building2,
  Sparkles,
  Shield,
  MessageSquare,
  ChevronDown,
  Check,
  Menu,
  X,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/db';
import { StatCard } from './StatCard';
import { ArrivalsTable } from './ArrivalsTable';
import { PendingRequestsList } from './PendingRequestsList';
import { OccupancyRevenueChart } from './OccupancyRevenueChart';
import { QuickReservationModal } from './QuickReservationModal';
import { ExportReportModal } from './ExportReportModal';
import { AuditLogDrawer } from './AuditLogDrawer';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { UserRole } from '../../types';

interface DashboardLayoutProps {
  onGoToLanding: () => void;
  onOpenOnboarding: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onGoToLanding,
  onOpenOnboarding,
}) => {
  const {
    user,
    currentHotel,
    availableHotels,
    switchHotel,
    logout,
    quickLogin,
    notifications,
    unreadNotifsCount,
    markAllNotificationsRead,
    markNotificationRead,
  } = useAuth();

  const [activeNav, setActiveNav] = useState<'dashboard' | 'reservations' | 'rooms' | 'analytics' | 'staff' | 'settings'>('dashboard');
  const [showResModal, setShowResModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAuditDrawer, setShowAuditDrawer] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  if (!currentHotel) return null;

  const metrics = db.getDashboardMetrics(currentHotel.id);
  const reservations = db.getReservations(currentHotel.id);
  const requests = db.getServiceRequests(currentHotel.id);

  const filteredReservations = searchQuery
    ? reservations.filter(
        (r) =>
          r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.roomTypeName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : reservations;

  return (
    <div className="min-h-screen bg-slate-100/70 flex text-slate-900 font-sans">
      {/* SIDEBAR - Exact match of Image 1 & Image 7 */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand & Branch Selector matching Image 1 */}
          <div className="p-6 border-b border-slate-100">
            <Logo size="md" />

            {/* Tenant Branch Switcher */}
            <div className="relative mt-4">
              <button
                type="button"
                onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 text-left transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {currentHotel.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentHotel.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{currentHotel.address.city}, {currentHotel.address.state}</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </button>

              {/* Branch Dropdown */}
              {showBranchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Alternar Propriedade (Tenant)
                  </div>
                  {availableHotels.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => {
                        switchHotel(h.id);
                        setShowBranchDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 ${
                        currentHotel.id === h.id ? 'bg-slate-50 font-bold text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      <span className="truncate">{h.name}</span>
                      {currentHotel.id === h.id && <Check className="w-3.5 h-3.5 text-[#b88e2f]" />}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setShowBranchDropdown(false);
                        onOpenOnboarding();
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs font-semibold text-[#b88e2f] hover:bg-slate-50 flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Cadastrar Novo Hotel</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links - Matching Image 1 & 7 */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveNav('reservations')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === 'reservations'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarCheck2 className="w-4 h-4" />
                <span>Reservations</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeNav === 'reservations' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {reservations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('rooms')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === 'rooms'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BedDouble className="w-4 h-4" />
              <span>Rooms</span>
            </button>

            <button
              onClick={() => setActiveNav('analytics')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === 'analytics'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveNav('staff')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === 'staff'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Staff</span>
            </button>

            <button
              onClick={() => setActiveNav('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === 'settings'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer matching Image 1 & 7 */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          {/* System Status Pill */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
            <span className="text-slate-500 font-medium">System Status</span>
            <span className="flex items-center gap-1.5 font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <button
              onClick={() => setShowAuditDrawer(true)}
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#b88e2f]" />
              <span>Auditoria</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/40 z-30 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* TOP BAR - Exact match of Image 1 & 7 */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">HotelFlow Admin</h1>
              <p className="text-xs text-slate-500">
                Good morning, <span className="font-semibold text-slate-700">{user?.name || 'Sarah'}</span>
              </p>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar hóspede, quarto ou código de reserva..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Action Buttons matching Image 1 & 7 */}
            <button
              onClick={() => setShowResModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-98"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Reservation</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition-all"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Report</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* Notifications Dropdown Popover */}
              {showNotifDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Notificações</span>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] text-[#b88e2f] hover:underline font-semibold"
                    >
                      Marcar lidas
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-slate-400 text-xs">
                        Nenhuma notificação recente
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer ${
                            !n.read ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <p className="font-bold text-slate-900">{n.title}</p>
                          <p className="text-slate-600 text-[11px] mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Sarah Jenkins'}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{user?.role.toLowerCase().replace('_', ' ')}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] text-slate-500">
                    Conectado como <strong>{user?.email}</strong>
                  </div>
                  <div className="px-3 py-2 text-[10px] font-bold uppercase text-slate-400">
                    Trocar Perfil / Permissão
                  </div>
                  {(['SUPER_ADMIN', 'HOTEL_ADMIN', 'MANAGER', 'RECEPTIONIST', 'STAFF'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        quickLogin(r);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 ${
                        user?.role === r ? 'font-bold text-[#b88e2f] bg-slate-50' : 'text-slate-700'
                      }`}
                    >
                      <span>{r.replace('_', ' ')}</span>
                      {user?.role === r && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={onGoToLanding}
                      className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50"
                    >
                      Ver Landing Page
                    </button>
                    <button
                      onClick={logout}
                      className="w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 font-semibold"
                    >
                      Sair da Conta
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* BODY DASHBOARD CONTENT */}
        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          {user?.role === 'SUPER_ADMIN' ? (
            <SuperAdminDashboard onOpenOnboarding={onOpenOnboarding} />
          ) : (
            <>
              {/* TOP METRIC STAT CARDS - Exact match of Image 1 & 7 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard type="reservations" data={metrics} />
                <StatCard type="checkins" data={metrics} />
                <StatCard type="occupancy" data={metrics} />
                <StatCard type="revenue" data={metrics} />
              </div>

              {/* CENTER OPERATIONAL GRID - Exact match of Image 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Today's Arrivals Table (7 cols) */}
                <div className="lg:col-span-7">
                  <ArrivalsTable
                    reservations={filteredReservations}
                    onRefresh={handleRefresh}
                    onViewAll={() => setActiveNav('reservations')}
                  />
                </div>

                {/* Right Column: Pending Requests List (5 cols) */}
                <div className="lg:col-span-5">
                  <PendingRequestsList
                    requests={requests}
                    onRefresh={handleRefresh}
                    onViewAll={() => setActiveNav('rooms')}
                  />
                </div>
              </div>

              {/* BOTTOM SECTION: Occupancy & Revenue Channels Chart */}
              <div className="grid grid-cols-1 gap-6">
                <OccupancyRevenueChart metrics={metrics} />
              </div>
            </>
          )}
        </main>
      </div>

      {/* MODALS & DRAWERS */}
      <QuickReservationModal
        isOpen={showResModal}
        onClose={() => setShowResModal(false)}
        onSuccess={handleRefresh}
      />

      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      <AuditLogDrawer
        isOpen={showAuditDrawer}
        onClose={() => setShowAuditDrawer(false)}
      />
    </div>
  );
};
