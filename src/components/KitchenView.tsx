import React from 'react';
import { Order, OrderStatus } from '../types';
import { ChefHat, CheckSquare } from 'lucide-react';

interface KitchenViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export default function KitchenView({ orders, onUpdateStatus }: KitchenViewProps) {
  const prepOrders = orders.filter(o => o.status === '製作中');

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F0EBE3] flex-1 min-h-[400px]">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-[#1A1A1A]">
          <div className="w-3 h-3 bg-[#BC2732] rounded-full"></div>
          <h1 className="text-2xl font-bold tracking-tight">廚房待製區</h1>
        </div>
        <span className="text-sm text-gray-400">當前 {prepOrders.length} 張訂單</span>
      </header>

      {prepOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <ChefHat size={48} className="opacity-20 mb-4" />
          <p className="text-lg tracking-wider">目前沒有待製作的訂單</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prepOrders.map(order => (
            <div key={order.orderId} className="border border-[#F0EBE3] rounded-2xl p-5 bg-white shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="font-bold text-xl text-[#1A1A1A]">序號: {order.pickupNumber} (桌 {String(order.tableNumber).padStart(2, '0')})</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-stone-500 font-mono">{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="mt-1 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest inline-block">
                    製作中
                  </div>
                </div>
              </div>

              <ul className="flex-1 text-sm space-y-2 mb-6 text-[#555]">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span>•</span> 
                    <span>{item.name} {item.addOns.length > 0 ? `(${item.addOns.join(', ')})` : ''} x{item.qty}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onUpdateStatus(order.orderId, '待結帳')}
                className="w-full py-3 bg-[#F5F2ED] hover:bg-[#E8E2D6] rounded-xl text-sm font-medium text-[#333333] transition-colors flex justify-center items-center gap-2"
              >
                <span>通知取餐</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
