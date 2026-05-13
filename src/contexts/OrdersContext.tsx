import React, { createContext, useContext, useState, useEffect } from 'react';

export interface OrderItem {
  id: string | number;
  name: string;
  salt: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  taxes: number;
  total: number;
  placedAt: string;
  status: 'Processing' | 'Confirmed' | 'Out for Delivery' | 'Delivered';
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (items: OrderItem[], subtotal: number, taxes: number, total: number) => string;
}

const OrdersContext = createContext<OrdersContextType | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('orders');
    if (saved) setOrders(JSON.parse(saved));
  }, []);

  const addOrder = (items: OrderItem[], subtotal: number, taxes: number, total: number): string => {
    const orderId = String(Math.floor(Math.random() * 900000) + 100000);
    const newOrder: Order = {
      id: Date.now().toString(),
      orderId,
      items,
      subtotal,
      taxes,
      total,
      placedAt: new Date().toISOString(),
      status: 'Processing',
    };
    setOrders(prev => {
      const updated = [newOrder, ...prev];
      localStorage.setItem('orders', JSON.stringify(updated));
      return updated;
    });
    return orderId;
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
