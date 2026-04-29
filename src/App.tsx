import React, { useState } from 'react';
import HomeView from './components/HomeView';
import OrderingView from './components/OrderingView';
import KitchenView from './components/KitchenView';
import CounterView from './components/CounterView';
import SettingsView from './components/SettingsView';
import { Order, OrderItem, OrderStatus } from './types';
import { Smartphone, Store, Home, Settings } from 'lucide-react';
import { DEFAULT_LOGO } from './data';

type ViewMode = 'home' | 'customer' | 'admin' | 'settings';

export default function App() {
  const [view, setView] = useState<ViewMode>('home');
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Global Store State
  const [storeName, setStoreName] = useState('雅・和食処');
  const [storeLogo, setStoreLogo] = useState(DEFAULT_LOGO);

  const handleSubmitOrder = (tableNumber: number, items: OrderItem[], totalAmount: number) => {
    const newOrder: Order = {
      orderId: Math.random().toString(36).substring(7),
      tableNumber,
      items,
      totalAmount,
      status: '製作中',
      timestamp: new Date().toISOString()
    };
    setOrders([...orders, newOrder]);
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
  };

  const activeTables: number[] = Array.from(new Set(orders.filter(o => o.status !== '已完成').map(o => o.tableNumber)));

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans selection:bg-[#F5F2ED] text-[#333333]">
      {/* Global Navigation - for demo purposes to switch between roles */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#2A2A2A] text-gray-400 text-xs py-2 px-4 flex justify-center space-x-6">
        <button 
          onClick={() => setView('home')} 
          className={`flex items-center space-x-1 hover:text-white transition-colors ${view === 'home' ? 'text-white font-medium' : ''}`}
        >
          <Home size={14} /> <span className="hidden sm:inline">首頁</span>
        </button>
        <button 
          onClick={() => setView('customer')} 
          className={`flex items-center space-x-1 hover:text-white transition-colors ${view === 'customer' ? 'text-white font-medium' : ''}`}
        >
          <Smartphone size={14} /> <span>點餐</span>
        </button>
        <button 
          onClick={() => setView('admin')} 
          className={`flex items-center space-x-1 hover:text-white transition-colors ${view === 'admin' ? 'text-white font-medium' : ''}`}
        >
          <Store size={14} /> <span>店家後台</span>
        </button>
        <button 
          onClick={() => setView('settings')} 
          className={`flex items-center space-x-1 hover:text-white transition-colors ${view === 'settings' ? 'text-white font-medium' : ''}`}
        >
          <Settings size={14} /> <span className="hidden sm:inline">系統維護</span>
        </button>
      </div>

      <div className="pt-8 min-h-screen flex flex-col">
        {view === 'home' && <HomeView storeName={storeName} storeLogo={storeLogo} onNavigate={setView} />}
        {view === 'customer' && <OrderingView storeName={storeName} storeLogo={storeLogo} activeTables={activeTables} onSubmitOrder={handleSubmitOrder} />}
        {view === 'admin' && (
          <div className="p-6 w-full max-w-7xl mx-auto flex-1 flex flex-col xl:flex-row gap-6">
            <div className="xl:flex-1">
              <KitchenView orders={orders} onUpdateStatus={handleUpdateStatus} />
            </div>
            <div className="xl:flex-[1.5]">
              <CounterView orders={orders} onUpdateStatus={handleUpdateStatus} />
            </div>
          </div>
        )}
        {view === 'settings' && (
          <SettingsView 
            storeName={storeName} 
            setStoreName={setStoreName} 
            storeLogo={storeLogo} 
            setStoreLogo={setStoreLogo} 
          />
        )}
      </div>
    </div>
  );
}

