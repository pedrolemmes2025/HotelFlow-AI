import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Hotel, UserRole, NotificationItem } from '../types';
import { db } from '../lib/db';

interface AuthContextType {
  user: User | null;
  currentHotel: Hotel | null;
  availableHotels: Hotel[];
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  quickLogin: (role: UserRole) => void;
  logout: () => void;
  switchHotel: (hotelId: string) => void;
  updateCurrentHotel: (updates: Partial<Hotel>) => void;
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  can: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(null);
  const [availableHotels, setAvailableHotels] = useState<Hotel[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial context
    const hotels = db.getHotels();
    setAvailableHotels(hotels);

    const savedHotelId = localStorage.getItem('hotelflow_active_hotel_id_v1') || 'hotel-grand-plaza';
    const hotel = db.getHotelById(savedHotelId) || hotels[0];
    setCurrentHotel(hotel || null);

    const savedUserId = localStorage.getItem('hotelflow_current_user_v1');
    if (savedUserId) {
      const users = db.getUsers();
      const found = users.find((u) => u.id === savedUserId);
      if (found) {
        setUser(found);
      } else {
        // Default login as Admin Sarah for rich demonstration
        const defaultUser = users.find((u) => u.id === 'user-admin-sarah') || users[0];
        setUser(defaultUser || null);
      }
    } else {
      const users = db.getUsers();
      const defaultUser = users.find((u) => u.id === 'user-admin-sarah') || users[0];
      setUser(defaultUser || null);
    }

    if (hotel) {
      setNotifications(db.getNotifications(hotel.id));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const foundUser = db.getUserByEmail(email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('hotelflow_current_user_v1', foundUser.id);
        
        if (foundUser.hotelId) {
          const hotel = db.getHotelById(foundUser.hotelId);
          if (hotel) {
            setCurrentHotel(hotel);
            localStorage.setItem('hotelflow_active_hotel_id_v1', hotel.id);
            setNotifications(db.getNotifications(hotel.id));
          }
        }
        
        db.logAction({
          userId: foundUser.id,
          userName: foundUser.name,
          hotelId: foundUser.hotelId,
          action: 'USER_LOGIN',
          target: foundUser.email,
          details: `Login bem-sucedido com perfil ${foundUser.role}`,
        });
        
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  const quickLogin = (role: UserRole) => {
    const users = db.getUsers();
    let target = users.find((u) => u.role === role);
    if (!target) {
      target = users[0];
    }
    if (target) {
      setUser(target);
      localStorage.setItem('hotelflow_current_user_v1', target.id);
      if (target.hotelId) {
        const hotel = db.getHotelById(target.hotelId);
        if (hotel) {
          setCurrentHotel(hotel);
          localStorage.setItem('hotelflow_active_hotel_id_v1', hotel.id);
          setNotifications(db.getNotifications(hotel.id));
        }
      }
      db.logAction({
        userId: target.id,
        userName: target.name,
        hotelId: target.hotelId,
        action: 'QUICK_LOGIN_SWITCH',
        target: target.email,
        details: `Alternou para perfil de demonstração ${role}`,
      });
    }
  };

  const logout = () => {
    if (user) {
      db.logAction({
        userId: user.id,
        userName: user.name,
        hotelId: user.hotelId,
        action: 'USER_LOGOUT',
        target: user.email,
        details: 'Sessão encerrada pelo usuário',
      });
    }
    setUser(null);
    localStorage.removeItem('hotelflow_current_user_v1');
  };

  const switchHotel = (hotelId: string) => {
    const hotel = db.getHotelById(hotelId);
    if (hotel) {
      setCurrentHotel(hotel);
      localStorage.setItem('hotelflow_active_hotel_id_v1', hotel.id);
      setNotifications(db.getNotifications(hotel.id));
      if (user) {
        db.logAction({
          userId: user.id,
          userName: user.name,
          hotelId: hotel.id,
          action: 'TENANT_SWITCH',
          target: hotel.name,
          details: `Alternou o contexto para o hotel ${hotel.name}`,
        });
      }
    }
  };

  const updateCurrentHotel = (updates: Partial<Hotel>) => {
    if (!currentHotel) return;
    const updated = db.updateHotel(currentHotel.id, updates);
    setCurrentHotel(updated);
    setAvailableHotels(db.getHotels());
  };

  const markNotificationRead = (id: string) => {
    db.markNotificationAsRead(id);
    if (currentHotel) {
      setNotifications(db.getNotifications(currentHotel.id));
    }
  };

  const markAllNotificationsRead = () => {
    if (currentHotel) {
      db.markAllNotificationsAsRead(currentHotel.id);
      setNotifications(db.getNotifications(currentHotel.id));
    }
  };

  const can = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    if (user.role === 'HOTEL_ADMIN') return true;
    if (user.role === 'MANAGER') {
      return permission !== 'manage_billing' && permission !== 'delete_hotel';
    }
    if (user.role === 'RECEPTIONIST') {
      return ['reservations', 'guests', 'checkin', 'checkout', 'requests', 'view_rooms'].includes(permission);
    }
    if (user.role === 'STAFF') {
      return ['tasks', 'requests', 'view_rooms'].includes(permission);
    }
    return false;
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        currentHotel,
        availableHotels,
        isLoading,
        login,
        quickLogin,
        logout,
        switchHotel,
        updateCurrentHotel,
        notifications,
        unreadNotifsCount,
        markNotificationRead,
        markAllNotificationsRead,
        can,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
