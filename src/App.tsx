/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import ConsultScreen from './screens/ConsultScreen';
import MedicinesScreen from './screens/MedicinesScreen';
import RecordsScreen from './screens/RecordsScreen';
import WellnessScreen from './screens/WellnessScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { ReminderProvider } from './contexts/ReminderContext';
import { CartProvider } from './contexts/CartContext';
import { AppointmentsProvider } from './contexts/AppointmentsContext';
import { OrdersProvider } from './contexts/OrdersContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

function MainApp() {
  const [activeTab, setActiveTab] = useState('home');
  const { screens } = useNavigation();
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen w-full flex justify-center bg-black font-sans" data-theme={resolvedTheme}>
      <div className={`relative w-full max-w-[390px] h-[100dvh] overflow-hidden flex flex-col transition-colors duration-500 translate-x-0 ${activeTab === 'wellness' ? 'bg-[#080F0C]' : 'bg-[#0A0A0F]'} text-white`}>
        {/* Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#6C63FF] opacity-15 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#00D4AA] opacity-15 blur-[80px] pointer-events-none" />

        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative z-10 pb-[90px]">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><HomeScreen setActiveTab={setActiveTab} /></motion.div>}
            {activeTab === 'consult' && <motion.div key="consult" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ConsultScreen /></motion.div>}
            {activeTab === 'medicines' && <motion.div key="medicines" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><MedicinesScreen /></motion.div>}
            {activeTab === 'records' && <motion.div key="records" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><RecordsScreen /></motion.div>}
            {activeTab === 'wellness' && <motion.div key="wellness" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><WellnessScreen /></motion.div>}
          </AnimatePresence>
        </main>

        <div className="absolute bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none">
          <div className="pointer-events-auto w-full">
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>

        {/* Sub-screens overlay */}
        <AnimatePresence>
          {screens.map((screen, index) => (
            <motion.div
              key={screen.id}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`absolute inset-0 z-50 overflow-y-auto overflow-x-hidden no-scrollbar ${activeTab === 'wellness' ? 'bg-[#080F0C]' : 'bg-[#0A0A0F]'}`}
              style={{ zIndex: 50 + index }}
            >
              {screen.component}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AppRoot() {
  const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem('hs_onboarded'));

  if (!onboarded) {
    return <OnboardingScreen onComplete={() => setOnboarded(true)} />;
  }

  return <MainApp />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationProvider>
          <CartProvider>
            <OrdersProvider>
              <AppointmentsProvider>
                <ReminderProvider>
                  <AppRoot />
                </ReminderProvider>
              </AppointmentsProvider>
            </OrdersProvider>
          </CartProvider>
        </NavigationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
