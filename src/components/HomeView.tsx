import React from 'react';
import { Smartphone, Store, Settings, ArrowRight } from 'lucide-react';

interface HomeViewProps {
  storeName: string;
  storeLogo: string;
  onNavigate: (view: 'customer' | 'admin' | 'settings') => void;
}

export default function HomeView({ storeName, storeLogo, onNavigate }: HomeViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
      <div className="text-center mb-12 animate-in slide-in-from-bottom-4 duration-700">
        <img 
          src={storeLogo} 
          alt="Store Logo" 
          className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-white shadow-lg object-cover"
        />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] mb-4">
          {storeName}
        </h1>
        <p className="text-[#8C7B6C] tracking-widest uppercase text-sm">
          Japanese Minimalist POS System
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <button
          onClick={() => onNavigate('customer')}
          className="group bg-white p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-[#F0EBE3] hover:border-[#333333] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="w-16 h-16 bg-[#F5F2ED] rounded-2xl flex items-center justify-center text-[#333333] group-hover:scale-110 transition-transform">
            <Smartphone size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">顧客點餐</h2>
            <p className="text-gray-500 text-sm">提供給顧客掃描或點擊進入的點餐頁面</p>
          </div>
          <div className="text-[#BC2732] flex items-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            進入系統 <ArrowRight size={16} className="ml-1" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('admin')}
          className="group bg-white p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-[#F0EBE3] hover:border-[#333333] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="w-16 h-16 bg-[#F5F2ED] rounded-2xl flex items-center justify-center text-[#333333] group-hover:scale-110 transition-transform">
            <Store size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">店家後台</h2>
            <p className="text-gray-500 text-sm">管理廚房訂單出餐狀態與櫃檯結帳</p>
          </div>
          <div className="text-[#BC2732] flex items-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            進入管理 <ArrowRight size={16} className="ml-1" />
          </div>
        </button>
      </div>

      <button
        onClick={() => onNavigate('settings')}
        className="mt-12 flex items-center text-sm text-gray-400 hover:text-[#333333] transition-colors"
      >
        <Settings size={16} className="mr-2" />
        <span>系統維護與設定</span>
      </button>
    </div>
  );
}
