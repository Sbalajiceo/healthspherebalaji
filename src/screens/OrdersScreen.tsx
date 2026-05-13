import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ShoppingBag, Clock, Truck, CheckCircle2, Package } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { useOrders } from '../contexts/OrdersContext';

export default function OrdersScreen() {
  const { popScreen } = useNavigation();
  const { orders } = useOrders();

  const statusConfig = (status: string) => {
    switch (status) {
      case 'Processing':       return { color: '#FFB347', bg: 'rgba(255,179,71,0.15)',    Icon: Clock };
      case 'Confirmed':        return { color: '#6C63FF', bg: 'rgba(108,99,255,0.15)',    Icon: Package };
      case 'Out for Delivery': return { color: '#00D4AA', bg: 'rgba(0,212,170,0.15)',     Icon: Truck };
      case 'Delivered':        return { color: '#8B8FA8', bg: 'rgba(139,143,168,0.15)',   Icon: CheckCircle2 };
      default:                 return { color: '#FFB347', bg: 'rgba(255,179,71,0.15)',    Icon: Clock };
    }
  };

  return (
    <div className="min-h-screen bg-[#111512] text-white pb-32">
      <div className="sticky top-0 z-40 bg-[#111512]/90 backdrop-blur-md px-5 py-4 flex items-center border-b border-white/5">
        <button onClick={popScreen} className="w-10 h-10 rounded-full bg-[#1A201D] flex items-center justify-center mr-3">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-bold text-lg">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center px-6 h-[70vh]">
          <div className="w-20 h-20 rounded-full bg-[#1A201D] flex items-center justify-center mb-6">
            <ShoppingBag size={36} className="text-[#4B5563]" />
          </div>
          <h2 className="font-bold text-2xl mb-3">No Orders Yet</h2>
          <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-[260px]">
            Your medicine orders will appear here after checkout.
          </p>
        </div>
      ) : (
        <div className="px-5 py-6 space-y-4">
          {orders.map((order, i) => {
            const { color, bg, Icon } = statusConfig(order.status);
            const date = new Date(order.placedAt);
            const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-[#1A201D] rounded-3xl p-5 border border-white/5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-lg">Order #MED-{order.orderId}</p>
                    <p className="text-[#9CA3AF] text-xs mt-0.5">{dateStr} at {timeStr}</p>
                  </div>
                  <span
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap"
                    style={{ color, background: bg }}
                  >
                    <Icon size={11} />
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, j) => (
                    <div key={j} className="flex items-center justify-between text-sm">
                      <span className="text-white/80">
                        {item.name} <span className="text-[#9CA3AF]">×{item.qty}</span>
                      </span>
                      <span className="font-medium">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="text-[#9CA3AF] text-sm">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </span>
                  <span className="font-bold text-[#84CC16]">₹{order.total} total</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
