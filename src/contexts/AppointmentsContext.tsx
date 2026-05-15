import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { isFirebaseConfigured } from '../lib/firebase';
import { subscribeToCollection, writeToCollection } from '../services/firestoreService';

export interface Appointment {
  id: string;
  doctorName: string;
  doctorSpec: string;
  doctorInitials: string;
  doctorColor: string;
  selectedDate: string;
  selectedTime: string;
  selectedType: string;
  bookedAt: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface AppointmentsContextType {
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'bookedAt' | 'status'>) => void;
}

const AppointmentsContext = createContext<AppointmentsContextType | null>(null);

const SEED_APPOINTMENT: Appointment = {
  id: 'seed-1',
  doctorName: 'Dr. Priya Sharma',
  doctorSpec: 'Cardiologist',
  doctorInitials: 'P',
  doctorColor: 'from-[#6C63FF] to-[#FF6B9D]',
  selectedDate: 'Tomorrow',
  selectedTime: '04:30 PM',
  selectedType: 'video',
  bookedAt: new Date().toISOString(),
  status: 'upcoming',
};

export function AppointmentsProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (isFirebaseConfigured) {
      // Real-time Firestore subscription
      return subscribeToCollection<Appointment>(
        userId, 'appointments', setAppointments, 'bookedAt'
      );
    }
    // localStorage fallback with seed data for first-time users
    const saved = localStorage.getItem('appointments');
    if (saved !== null) {
      setAppointments(JSON.parse(saved));
    } else {
      setAppointments([SEED_APPOINTMENT]);
      localStorage.setItem('appointments', JSON.stringify([SEED_APPOINTMENT]));
    }
  }, [userId]);

  const addAppointment = (apt: Omit<Appointment, 'id' | 'bookedAt' | 'status'>) => {
    const newApt: Appointment = {
      ...apt,
      id: Date.now().toString(),
      bookedAt: new Date().toISOString(),
      status: 'upcoming',
    };

    if (isFirebaseConfigured) {
      writeToCollection(userId, 'appointments', newApt);
    } else {
      setAppointments((prev) => {
        const updated = [newApt, ...prev];
        localStorage.setItem('appointments', JSON.stringify(updated));
        return updated;
      });
    }
  };

  return (
    <AppointmentsContext.Provider value={{ appointments, addAppointment }}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error('useAppointments must be used within AppointmentsProvider');
  return ctx;
}
