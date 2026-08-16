export type UserRole = 'SUPER_ADMIN' | 'HOTEL_ADMIN' | 'MANAGER' | 'RECEPTIONIST' | 'STAFF';

export interface User {
  id: string;
  hotelId?: string; // null for SUPER_ADMIN
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  active: boolean;
  createdAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  whatsapp: string;
  email: string;
  checkInTime: string; // e.g. "14:00"
  checkOutTime: string; // e.g. "12:00"
  breakfast: {
    included: boolean;
    price?: number;
    hours: string; // "06:30 - 10:00"
    location: string;
  };
  parking: {
    available: boolean;
    valet: boolean;
    pricePerDay?: number;
  };
  policies: {
    cancellation: string;
    petsAllowed: boolean;
    smokingAllowed: boolean;
    quietHours: string;
  };
  aiPersonality: 'FORMAL' | 'FRIENDLY' | 'PREMIUM' | 'OBJECTIVE';
  planId: 'STARTER' | 'PRO' | 'PREMIUM';
  status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'SUSPENDED';
  createdAt: string;
}

export type RoomCategory = 'STANDARD' | 'DELUXE' | 'SUITE' | 'FAMILY' | 'PRESIDENTIAL' | 'CUSTOM';

export type RoomStatus = 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE' | 'BLOCKED';

export interface RoomType {
  id: string;
  hotelId: string;
  category: RoomCategory;
  name: string;
  description: string;
  capacityAdults: number;
  capacityChildren: number;
  bedSetup: string;
  basePrice: number;
  promoPrice?: number;
  amenities: string[];
  photos: string[];
}

export interface Room {
  id: string;
  hotelId: string;
  roomTypeId: string;
  roomTypeName: string;
  number: string;
  floor: number;
  name: string;
  status: RoomStatus;
  currentGuestName?: string;
  currentReservationId?: string;
  notes?: string;
}

export type GuestTag = 'VIP' | 'FREQUENT' | 'NEW' | 'FAMILY' | 'CORPORATE' | 'BIRTHDAY';

export interface Guest {
  id: string;
  hotelId: string;
  name: string;
  email: string;
  phone: string;
  document: string; // CPF or Passport
  birthDate?: string;
  country: string;
  tags: GuestTag[];
  notes?: string;
  totalSpent: number;
  staysCount: number;
  ratingAverage?: number;
  createdAt: string;
}

export type ReservationStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'CHECKED_IN' 
  | 'STAYING' 
  | 'CHECKED_OUT' 
  | 'CANCELLED' 
  | 'NO_SHOW';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'BOLETO' | 'CASH' | 'GATEWAY';

export interface ExtraServiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Reservation {
  id: string;
  code: string; // e.g. "RES-8921"
  hotelId: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestDocument?: string;
  roomId?: string;
  roomNumber?: string;
  roomTypeId?: string;
  roomTypeName: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  checkInTimeEstimated?: string; // "14:00"
  actualCheckIn?: string;
  actualCheckOut?: string;
  eta?: string;
  adults: number;
  children: number;
  dailyRate?: number;
  nights: number;
  subtotal?: number;
  discount?: number;
  paidAmount?: number;
  extraServicesTotal?: number;
  extraServices?: ExtraServiceItem[];
  totalAmount: number;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  origin?: 'WHATSAPP_AI' | 'DIRECT_WEBSITE' | 'RECEPTION' | 'BOOKING_COM' | 'EXPEDIA';
  channel?: 'WHATSAPP_AI' | 'DIRECT_SITE' | 'DESK' | 'BOOKING_COM' | 'EXPEDIA';
  notes?: string;
  createdAt: string;
}

export type ServiceType = 
  | 'TOWELS' 
  | 'CLEANING' 
  | 'MAINTENANCE' 
  | 'ROOM_SERVICE' 
  | 'PILLOW_BLANKET' 
  | 'TRANSPORT' 
  | 'BREAKFAST_IN_ROOM' 
  | 'LATE_CHECKOUT' 
  | 'OTHER';

export type RequestPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ServiceRequest {
  id: string;
  hotelId: string;
  reservationId?: string;
  roomNumber: string;
  guestName: string;
  type: ServiceType;
  title: string;
  description: string;
  priority: RequestPriority;
  status: RequestStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  requestedAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

export interface AuditLog {
  id: string;
  hotelId?: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  hotelId: string;
  title: string;
  message: string;
  type: 'RESERVATION' | 'PAYMENT' | 'REQUEST' | 'WHATSAPP' | 'REVIEW' | 'SYSTEM';
  read: boolean;
  link?: string;
  timestamp: string;
}

export interface DashboardMetrics {
  todayReservations: number;
  todayReservationsGrowth: number;
  todayCheckIns: { completed: number; total: number };
  todayCheckOuts: { completed: number; total: number };
  occupancyRate: number;
  occupancyGrowthWoW: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  cleaningRooms: number;
  maintenanceRooms: number;
  todayRevenue: number;
  projectedRevenue: number;
  revenueGrowth: number;
  monthRevenue: number;
  averageDailyRate: number;
  revPar: number;
  activeAiConversations: number;
  pendingRequestsCount: number;
  abandonedBookingsValue: number;
  recoveredBookingsValue: number;
}
