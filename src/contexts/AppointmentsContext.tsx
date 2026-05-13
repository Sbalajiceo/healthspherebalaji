import React, { createContext, useContext, useState, useEffect } from 'react';

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

export function AppointmentsProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('appointments');
    if (saved !== null) {
      setAppointments(JSON.parse(saved));
    } else {
      const seed: Appointment[] = [{
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
      }];
      setAppointments(seed);
      localStorage.setItem('appointments', JSON.stringify(seed));
    }
  }, []);

  const addAppointment = (apt: Omit<Appointment, 'id' | 'bookedAt' | 'status'>) => {
    setAppointments(prev => {
      const newApt: Appointment = {
        ...apt,
        id: Date.now().toString(),
        bookedAt: new Date().toISOString(),
        status: 'upcoming',
      };
      const updated = [newApt, ...prev];
      localStorage.setItem('appointments', JSON.stringify(updated));
      return updated;
    });
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
