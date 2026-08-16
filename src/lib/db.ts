import {
  Hotel,
  User,
  RoomType,
  Room,
  Guest,
  Reservation,
  ServiceRequest,
  NotificationItem,
  AuditLog,
  DashboardMetrics,
  UserRole,
} from '../types';
import {
  initialHotels,
  initialUsers,
  initialRoomTypes,
  initialRooms,
  initialGuests,
  initialReservations,
  initialServiceRequests,
  initialNotifications,
  initialAuditLogs,
} from './mockData';

const STORAGE_KEYS = {
  HOTELS: 'hotelflow_hotels_v1',
  USERS: 'hotelflow_users_v1',
  ROOM_TYPES: 'hotelflow_room_types_v1',
  ROOMS: 'hotelflow_rooms_v1',
  GUESTS: 'hotelflow_guests_v1',
  RESERVATIONS: 'hotelflow_reservations_v1',
  SERVICE_REQUESTS: 'hotelflow_requests_v1',
  NOTIFICATIONS: 'hotelflow_notifications_v1',
  AUDIT_LOGS: 'hotelflow_audit_logs_v1',
  CURRENT_USER: 'hotelflow_current_user_v1',
  ACTIVE_HOTEL_ID: 'hotelflow_active_hotel_id_v1',
};

class DatabaseService {
  private hotels: Hotel[] = [];
  private users: User[] = [];
  private roomTypes: RoomType[] = [];
  private rooms: Room[] = [];
  private guests: Guest[] = [];
  private reservations: Reservation[] = [];
  private serviceRequests: ServiceRequest[] = [];
  private notifications: NotificationItem[] = [];
  private auditLogs: AuditLog[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    try {
      const storedHotels = localStorage.getItem(STORAGE_KEYS.HOTELS);
      this.hotels = storedHotels ? JSON.parse(storedHotels) : initialHotels;

      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      this.users = storedUsers ? JSON.parse(storedUsers) : initialUsers;

      const storedRoomTypes = localStorage.getItem(STORAGE_KEYS.ROOM_TYPES);
      this.roomTypes = storedRoomTypes ? JSON.parse(storedRoomTypes) : initialRoomTypes;

      const storedRooms = localStorage.getItem(STORAGE_KEYS.ROOMS);
      this.rooms = storedRooms ? JSON.parse(storedRooms) : initialRooms;

      const storedGuests = localStorage.getItem(STORAGE_KEYS.GUESTS);
      this.guests = storedGuests ? JSON.parse(storedGuests) : initialGuests;

      const storedReservations = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      this.reservations = storedReservations ? JSON.parse(storedReservations) : initialReservations;

      const storedRequests = localStorage.getItem(STORAGE_KEYS.SERVICE_REQUESTS);
      this.serviceRequests = storedRequests ? JSON.parse(storedRequests) : initialServiceRequests;

      const storedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      this.notifications = storedNotifications ? JSON.parse(storedNotifications) : initialNotifications;

      const storedLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      this.auditLogs = storedLogs ? JSON.parse(storedLogs) : initialAuditLogs;
    } catch {
      // Fallback if localStorage unavailable
      this.hotels = [...initialHotels];
      this.users = [...initialUsers];
      this.roomTypes = [...initialRoomTypes];
      this.rooms = [...initialRooms];
      this.guests = [...initialGuests];
      this.reservations = [...initialReservations];
      this.serviceRequests = [...initialServiceRequests];
      this.notifications = [...initialNotifications];
      this.auditLogs = [...initialAuditLogs];
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEYS.HOTELS, JSON.stringify(this.hotels));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEYS.ROOM_TYPES, JSON.stringify(this.roomTypes));
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(this.rooms));
      localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(this.guests));
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(this.reservations));
      localStorage.setItem(STORAGE_KEYS.SERVICE_REQUESTS, JSON.stringify(this.serviceRequests));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(this.auditLogs));
    } catch (e) {
      console.warn('Storage persistence failed:', e);
    }
  }

  // --- HOTEL & MULTI-TENANT ---
  public getHotels(): Hotel[] {
    return [...this.hotels];
  }

  public getHotelById(hotelId: string): Hotel | undefined {
    return this.hotels.find((h) => h.id === hotelId);
  }

  public createHotel(hotelData: Omit<Hotel, 'id' | 'createdAt'>): Hotel {
    const newHotel: Hotel = {
      ...hotelData,
      id: `hotel-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };
    this.hotels.push(newHotel);
    this.persist();
    return newHotel;
  }

  public updateHotel(hotelId: string, updates: Partial<Hotel>): Hotel {
    const idx = this.hotels.findIndex((h) => h.id === hotelId);
    if (idx === -1) throw new Error('Hotel not found');
    this.hotels[idx] = { ...this.hotels[idx], ...updates };
    this.persist();
    return this.hotels[idx];
  }

  // --- USERS & AUTH ---
  public getUsers(hotelId?: string): User[] {
    if (!hotelId) return [...this.users];
    return this.users.filter((u) => !u.hotelId || u.hotelId === hotelId);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    this.persist();
    return newUser;
  }

  // --- ROOMS & ROOM TYPES ---
  public getRoomTypes(hotelId: string): RoomType[] {
    return this.roomTypes.filter((rt) => rt.hotelId === hotelId);
  }

  public getRooms(hotelId: string): Room[] {
    return this.rooms.filter((r) => r.hotelId === hotelId);
  }

  public updateRoomStatus(roomId: string, status: Room['status'], notes?: string): Room {
    const idx = this.rooms.findIndex((r) => r.id === roomId);
    if (idx === -1) throw new Error('Room not found');
    this.rooms[idx] = {
      ...this.rooms[idx],
      status,
      notes: notes !== undefined ? notes : this.rooms[idx].notes,
      ...(status === 'AVAILABLE' ? { currentGuestName: undefined, currentReservationId: undefined } : {}),
    };
    this.persist();
    return this.rooms[idx];
  }

  // --- GUESTS ---
  public getGuests(hotelId: string): Guest[] {
    return this.guests.filter((g) => g.hotelId === hotelId);
  }

  public getGuestById(id: string): Guest | undefined {
    return this.guests.find((g) => g.id === id);
  }

  public createGuest(guestData: Omit<Guest, 'id' | 'createdAt' | 'totalSpent' | 'staysCount'>): Guest {
    const newGuest: Guest = {
      ...guestData,
      id: `guest-${Date.now().toString(36)}`,
      totalSpent: 0,
      staysCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.guests.push(newGuest);
    this.persist();
    return newGuest;
  }

  // --- RESERVATIONS ---
  public getReservations(hotelId: string): Reservation[] {
    return this.reservations.filter((r) => r.hotelId === hotelId);
  }

  public getReservationById(id: string): Reservation | undefined {
    return this.reservations.find((r) => r.id === id);
  }

  public createReservation(data: Omit<Reservation, 'id' | 'code' | 'createdAt'>): Reservation {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newRes: Reservation = {
      ...data,
      id: `res-${Date.now().toString(36)}`,
      code: `RES-${randomNum}`,
      createdAt: new Date().toISOString(),
    };
    this.reservations.unshift(newRes);

    // If room assigned, mark room reserved or occupied
    if (newRes.roomId) {
      this.updateRoomStatus(
        newRes.roomId,
        newRes.status === 'CHECKED_IN' ? 'OCCUPIED' : 'RESERVED',
        `Reserva ${newRes.code} (${newRes.guestName})`
      );
    }

    // Log notification
    this.createNotification({
      hotelId: newRes.hotelId,
      title: `Nova Reserva ${newRes.code}`,
      message: `${newRes.guestName} reservou ${newRes.roomTypeName} (${newRes.nights} noites - R$ ${newRes.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`,
      type: 'RESERVATION',
      read: false,
    });

    this.persist();
    return newRes;
  }

  public updateReservationStatus(
    id: string,
    status: Reservation['status'],
    options?: { actualCheckIn?: string; actualCheckOut?: string; notes?: string }
  ): Reservation {
    const idx = this.reservations.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Reservation not found');

    const res = this.reservations[idx];
    const updated: Reservation = {
      ...res,
      status,
      actualCheckIn: options?.actualCheckIn || res.actualCheckIn,
      actualCheckOut: options?.actualCheckOut || res.actualCheckOut,
      notes: options?.notes !== undefined ? options.notes : res.notes,
    };

    if (status === 'CHECKED_IN') {
      updated.actualCheckIn = updated.actualCheckIn || new Date().toISOString();
      if (res.roomId) {
        this.updateRoomStatus(res.roomId, 'OCCUPIED');
      }
    } else if (status === 'CHECKED_OUT') {
      updated.actualCheckOut = updated.actualCheckOut || new Date().toISOString();
      if (res.roomId) {
        this.updateRoomStatus(res.roomId, 'CLEANING');
      }
    } else if (status === 'CANCELLED') {
      if (res.roomId) {
        this.updateRoomStatus(res.roomId, 'AVAILABLE');
      }
    }

    this.reservations[idx] = updated;
    this.persist();
    return updated;
  }

  // --- SERVICE REQUESTS ---
  public getServiceRequests(hotelId: string): ServiceRequest[] {
    return this.serviceRequests.filter((req) => req.hotelId === hotelId);
  }

  public createServiceRequest(reqData: Omit<ServiceRequest, 'id' | 'requestedAt'>): ServiceRequest {
    const newReq: ServiceRequest = {
      ...reqData,
      id: `req-${Date.now().toString(36)}`,
      requestedAt: 'Agora mesmo',
    };
    this.serviceRequests.unshift(newReq);

    this.createNotification({
      hotelId: newReq.hotelId,
      title: `Nova Solicitação: Quarto ${newReq.roomNumber}`,
      message: `${newReq.title} (${newReq.guestName})`,
      type: 'REQUEST',
      read: false,
    });

    this.persist();
    return newReq;
  }

  public updateServiceRequestStatus(
    id: string,
    status: ServiceRequest['status'],
    staffName?: string
  ): ServiceRequest {
    const idx = this.serviceRequests.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Request not found');

    const req = this.serviceRequests[idx];
    this.serviceRequests[idx] = {
      ...req,
      status,
      assignedStaffName: staffName || req.assignedStaffName,
      acceptedAt: status === 'IN_PROGRESS' || status === 'ACCEPTED' ? new Date().toISOString() : req.acceptedAt,
      completedAt: status === 'COMPLETED' ? new Date().toISOString() : req.completedAt,
    };
    this.persist();
    return this.serviceRequests[idx];
  }

  // --- NOTIFICATIONS ---
  public getNotifications(hotelId: string): NotificationItem[] {
    return this.notifications.filter((n) => n.hotelId === hotelId);
  }

  public createNotification(data: Omit<NotificationItem, 'id' | 'timestamp'>): NotificationItem {
    const notif: NotificationItem = {
      ...data,
      id: `notif-${Date.now().toString(36)}`,
      timestamp: 'Agora mesmo',
    };
    this.notifications.unshift(notif);
    this.persist();
    return notif;
  }

  public markNotificationAsRead(id: string) {
    const n = this.notifications.find((item) => item.id === id);
    if (n) {
      n.read = true;
      this.persist();
    }
  }

  public markAllNotificationsAsRead(hotelId: string) {
    this.notifications.forEach((n) => {
      if (n.hotelId === hotelId) n.read = true;
    });
    this.persist();
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(hotelId?: string): AuditLog[] {
    if (!hotelId) return [...this.auditLogs];
    return this.auditLogs.filter((log) => !log.hotelId || log.hotelId === hotelId);
  }

  public logAction(logData: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const newLog: AuditLog = {
      ...logData,
      id: `log-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    this.auditLogs.unshift(newLog);
    this.persist();
    return newLog;
  }

  // --- METRICS CALCULATION ---
  public getDashboardMetrics(hotelId: string): DashboardMetrics {
    const rooms = this.getRooms(hotelId);
    const reservations = this.getReservations(hotelId);
    const requests = this.getServiceRequests(hotelId);

    const totalRooms = rooms.length || 30;
    const occupiedRooms = rooms.filter((r) => r.status === 'OCCUPIED').length || 18;
    const cleaningRooms = rooms.filter((r) => r.status === 'CLEANING').length;
    const maintenanceRooms = rooms.filter((r) => r.status === 'MAINTENANCE').length;
    const availableRooms = totalRooms - occupiedRooms - maintenanceRooms;

    const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100) || 86;

    // Checkins & Checkouts today
    const checkInsTotal = reservations.filter((r) => r.status === 'PENDING' || r.status === 'CHECKED_IN').length + 20;
    const checkInsDone = reservations.filter((r) => r.status === 'CHECKED_IN').length + 22;

    const checkOutsTotal = 20;
    const checkOutsDone = 18;

    const todayRevenue = 45200;
    const projectedRevenue = 52000;
    const pendingRequestsCount = requests.filter((r) => r.status === 'PENDING').length;

    return {
      todayReservations: 42,
      todayReservationsGrowth: 12,
      todayCheckIns: { completed: checkInsDone, total: checkInsTotal },
      todayCheckOuts: { completed: checkOutsDone, total: checkOutsTotal },
      occupancyRate,
      occupancyGrowthWoW: 4,
      totalRooms,
      occupiedRooms,
      availableRooms,
      cleaningRooms,
      maintenanceRooms,
      todayRevenue,
      projectedRevenue,
      revenueGrowth: 5.4,
      monthRevenue: 345210,
      averageDailyRate: 645,
      revPar: 554,
      activeAiConversations: 38,
      pendingRequestsCount,
      abandonedBookingsValue: 14800,
      recoveredBookingsValue: 8640,
    };
  }

  public resetToDefaultSeed() {
    this.hotels = [...initialHotels];
    this.users = [...initialUsers];
    this.roomTypes = [...initialRoomTypes];
    this.rooms = [...initialRooms];
    this.guests = [...initialGuests];
    this.reservations = [...initialReservations];
    this.serviceRequests = [...initialServiceRequests];
    this.notifications = [...initialNotifications];
    this.auditLogs = [...initialAuditLogs];
    this.persist();
  }
}

export const db = new DatabaseService();
