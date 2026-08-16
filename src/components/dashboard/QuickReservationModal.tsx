import React, { useState } from 'react';
import { X, Calendar, User, Bed, DollarSign, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/db';
import { RoomType } from '../../types';

interface QuickReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const QuickReservationModal: React.FC<QuickReservationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentHotel, user } = useAuth();
  const roomTypes = currentHotel ? db.getRoomTypes(currentHotel.id) : [];

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState(roomTypes[0]?.id || '');
  const [checkIn, setCheckIn] = useState(new Date().toISOString().substring(0, 10));
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const [checkOut, setCheckOut] = useState(tomorrow.toISOString().substring(0, 10));
  const [adults, setAdults] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD' | 'PAY_AT_CHECKIN'>('PIX');
  const [channel, setChannel] = useState<'DIRECT_SITE' | 'WHATSAPP_AI' | 'DESK'>('DESK');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !currentHotel) return null;

  const selectedRoomType = roomTypes.find((rt) => rt.id === selectedRoomTypeId) || roomTypes[0];
  const pricePerNight = selectedRoomType ? selectedRoomType.basePrice : 450;
  const nights = Math.max(
    1,
    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
  );
  const totalAmount = nights * pricePerNight;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Find an available room of this type
      const rooms = db.getRooms(currentHotel.id);
      const targetRoom = rooms.find(
        (r) => r.roomTypeId === selectedRoomType?.id && r.status === 'AVAILABLE'
      );

      const newRes = db.createReservation({
        hotelId: currentHotel.id,
        guestId: `guest-${Date.now()}`,
        guestName,
        guestEmail,
        guestPhone: guestPhone || '+55 (11) 99999-0000',
        roomId: targetRoom?.id,
        roomNumber: targetRoom?.number || 'A Definir',
        roomTypeId: selectedRoomType?.id || 'rt-standard',
        roomTypeName: selectedRoomType?.name || 'Standard King Room',
        checkInDate: checkIn,
        checkOutDate: checkOut,
        nights,
        adults,
        children: 0,
        status: 'PENDING',
        totalAmount,
        paidAmount: paymentMethod === 'PAY_AT_CHECKIN' ? 0 : totalAmount,
        paymentStatus: paymentMethod === 'PAY_AT_CHECKIN' ? 'PENDING' : 'PAID',
        paymentMethod,
        channel,
        eta: '14:00',
      });

      if (user) {
        db.logAction({
          userId: user.id,
          userName: user.name,
          hotelId: currentHotel.id,
          action: 'RESERVATION_CREATED',
          target: `${newRes.code} (${guestName})`,
          details: `Nova reserva criada via ${channel} no valor de R$ ${totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        });
      }

      setIsSubmitting(false);
      onSuccess();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">Nova Reserva Rápida</h3>
            <p className="text-xs text-slate-500">Cadastre uma nova estadia com emissão automática de voucher</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo do Hóspede</label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Ex: Roberto Almeida"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="roberto@email.com"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Telefone</label>
              <input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+55 (11) 98888-7777"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria de Quarto</label>
              <select
                value={selectedRoomTypeId}
                onChange={(e) => setSelectedRoomTypeId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {roomTypes.map((rt) => (
                  <option key={rt.id} value={rt.id}>
                    {rt.name} (R$ {rt.basePrice}/noite)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Origem da Reserva</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="DESK">Balcão / Recepção</option>
                <option value="WHATSAPP_AI">WhatsApp IA</option>
                <option value="DIRECT_SITE">Site Direto</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data Check-In</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data Check-Out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing summary badge */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">Resumo do Período</span>
              <p className="text-sm font-bold text-slate-900">
                {nights} {nights === 1 ? 'diária' : 'diárias'} × R$ {pricePerNight}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Valor Total</span>
              <p className="text-xl font-bold text-[#b88e2f]">
                R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Forma de Pagamento</label>
            <div className="grid grid-cols-3 gap-2 text-xs font-medium">
              {[
                { id: 'PIX', label: '⚡ PIX Instantâneo' },
                { id: 'CREDIT_CARD', label: '💳 Cartão de Crédito' },
                { id: 'PAY_AT_CHECKIN', label: '🏨 Pagar no Check-in' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === m.id
                      ? 'border-slate-900 bg-slate-900 text-white font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-md transition-all active:scale-98 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
