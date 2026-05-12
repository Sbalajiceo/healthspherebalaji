import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Calendar, Clock, Video, Phone, MessageSquare } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { useAppointments, Appointment } from '../contexts/AppointmentsContext';

export default function AppointmentsScreen() {
  const { popScreen } = useNavigation();
  const { appointments } = useAppointments();

  const upcoming = appointments.filter(a => a.status === 'upcoming');
  const past = appointments.filter(a => a.status !== 'upcoming');

  const typeIcon = (type: string) => {
    const t = type?.toLowerCase();
    if (t === 'video') return Video;
    if (t === 'audio' || t === 'phone' || t === 'physical') return Phone;
    return MessageSquare;
  };

  const statusConfig = (status: string) => {
    switch (status) {
      case 'upcoming': return { color: '#00D4AA', bg: 'rgba(0,212,170,0.15)', label: 'Confirmed' };
      case 'completed': return { color: '#8B8FA8', bg: 'rgba(139,143,168,0.15)', label: 'Completed' };
      case 'cancelled': return { color: '#FF4B4B', bg: 'rgba(255,75,75,0.15)', label: 'Cancelled' };
      default: return { color: '#00D4AA', bg: 'rgba(0,212,170,0.15)', label: 'Confirmed' };
    }
  };

  const renderCard = (apt: Appointment, i: number) => {
    const TypeIcon = typeIcon(apt.selectedType);
    const status = statusConfig(apt.status);
    return (
      <motion.div
        key={apt.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08 }}
        className="glass-card rounded-2xl p-5 border border-white/5"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${apt.doctorColor || 'from-[#6C63FF] to-[#00D4AA]'} flex items-center justify-center font-bold text-lg font-display`}>
              {apt.doctorInitials}
            </div>
            <div>
              <h3 className="font-bold text-white">{apt.doctorName}</h3>
              <p className="text-xs text-[#8B8FA8]">{apt.doctorSpec}</p>
            </div>
          </div>
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap"
            style={{ color: status.color, background: status.bg }}
          >
            {status.label}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-[#8B8FA8]">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-[#6C63FF]" />
            <span>{apt.selectedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-[#6C63FF]" />
            <span>{apt.selectedTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TypeIcon size={13} className="text-[#6C63FF]" />
            <span className="capitalize">{apt.selectedType}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-32">
      <div className="sticky top-0 z-40 bg-[#0A0A0F]/80 backdrop-blur-md px-4 py-4 flex items-center border-b border-white/5">
        <button onClick={popScreen} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-3">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-display text-xl font-bold">My Appointments</h1>
      </div>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center px-6 h-[70vh]">
          <div className="w-20 h-20 rounded-full bg-[#6C63FF]/10 flex items-center justify-center mb-6">
            <Calendar size={36} className="text-[#6C63FF]/50" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-3">No Appointments</h2>
          <p className="text-[#8B8FA8] text-sm leading-relaxed max-w-[260px]">
            Your booked consultations will appear here. Start by consulting a doctor.
          </p>
        </div>
      ) : (
        <div className="px-4 py-6 space-y-6">
          {upcoming.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                Upcoming
                <span className="w-5 h-5 rounded-full bg-[#00D4AA]/20 text-[#00D4AA] text-[10px] font-bold flex items-center justify-center">
                  {upcoming.length}
                </span>
              </h2>
              <div className="space-y-3">
                {upcoming.map((apt, i) => renderCard(apt, i))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold mb-4 text-[#8B8FA8]">Past</h2>
              <div className="space-y-3">
                {past.map((apt, i) => renderCard(apt, i))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
