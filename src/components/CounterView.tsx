import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { Calculator, Receipt, CheckCircle } from 'lucide-react';

interface CounterViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export default function CounterView({ orders, onUpdateStatus }: CounterViewProps) {
  // Group active orders by table
  const activeOrders = orders.filter(o => o.status !== '已完成');
  
  const tablesWithOrders = Array.from(new Set(activeOrders.map(o => o.tableNumber))).sort((a,b) => a - b);
  
  const [selectedTable, setSelectedTable] = useState<number | null>(tablesWithOrders.length > 0 ? tablesWithOrders[0] : null);

  const tableOrders = selectedTable 
    ? activeOrders.filter(o => o.tableNumber === selectedTable)
    : [];

  const tableTotal = tableOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const canCheckout = tableOrders.every(o => o.status === '待結帳');

  const handleCheckout = () => {
    if (!selectedTable) return;
    tableOrders.forEach(o => {
      onUpdateStatus(o.orderId, '已完成');
    });
    setSelectedTable(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full min-h-[400px]">
      {/* Left side: Table list */}
      <div className="md:w-1/3 bg-white rounded-3xl p-6 shadow-sm border border-[#F0EBE3] flex flex-col">
        <header className="mb-6 flex items-center space-x-3 text-[#1A1A1A]">
          <div className="w-3 h-3 bg-[#BC2732] rounded-full"></div>
          <h1 className="text-xl font-bold tracking-tight">桌位列表</h1>
        </header>

        {tablesWithOrders.length === 0 ? (
          <p className="text-gray-400 py-10 text-center">目前沒有用餐中的桌位</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {tablesWithOrders.map(tableNum => {
              const ordersForTable = activeOrders.filter(o => o.tableNumber === tableNum);
              const allReady = ordersForTable.every(o => o.status === '待結帳');
              
              return (
                <button
                  key={tableNum}
                  onClick={() => setSelectedTable(tableNum)}
                  className={`py-4 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    selectedTable === tableNum 
                      ? 'border-[#333333] bg-[#333333] text-white shadow-[0_4px_10px_rgba(0,0,0,0.1)]' 
                      : 'border-[#F0EBE3] bg-white hover:bg-[#F5F2ED] text-[#333333]'
                  }`}
                >
                  <span className="text-xs opacity-70 mb-1 font-medium">桌號</span>
                  <span className="text-2xl font-bold tracking-tighter">{String(tableNum).padStart(2, '0')}</span>
                  <div className={`w-2 h-2 rounded-full mt-2 ${allReady ? 'bg-gray-400' : 'bg-red-500'}`} />
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Right side: Order details */}
      <div className="flex-1">
        {selectedTable ? (
          <div className="bg-[#333333] text-white rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex flex-col min-h-full">
            <div className="flex justify-between items-center mb-8 border-b border-[#555] pb-4">
              <div>
                <span className="text-gray-400 tracking-widest text-xs uppercase">TABLE</span>
                <h2 className="text-3xl font-bold tracking-tight">桌號 {String(selectedTable).padStart(2, '0')}</h2>
              </div>
              <div className="bg-[#444] p-3 rounded-xl text-gray-300">
                <Receipt size={24} />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {tableOrders.map(order => (
                <div key={order.orderId} className="bg-[#444] rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400 font-mono">{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-widest ${order.status === '待結帳' ? 'bg-gray-200 text-gray-600' : 'bg-red-50 text-red-600'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start">
                        <div className="flex space-x-3">
                          <span className="font-bold text-gray-300">{item.qty}x</span>
                          <div>
                            <p className="font-medium text-white">{item.name}</p>
                            <p className="text-xs text-gray-400 italic">{item.size} {item.addOns.length > 0 ? `+ ${item.addOns.join(', ')}` : ''}</p>
                          </div>
                        </div>
                        <span className="font-bold">${item.subtotal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#555] pt-6 mt-auto">
              <div className="flex justify-between items-center mb-8">
                <span className="text-sm text-gray-400">總計金額</span>
                <span className="text-4xl font-light tracking-tighter">${tableTotal} <span className="text-sm opacity-40 font-sans tracking-normal">TWD</span></span>
              </div>

              {canCheckout ? (
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#BC2732] hover:bg-red-700 text-white py-4 rounded-xl font-bold tracking-widest text-lg shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <CheckCircle size={24} />
                  <span>完成結帳</span>
                </button>
              ) : (
                <div className="border border-[#555] text-gray-400 p-4 rounded-xl text-center text-sm font-medium tracking-wide">
                  餐點尚在製作中，請稍後結帳
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-[#8C7B6C] bg-transparent rounded-3xl border border-[#DED9D1] border-dashed py-20 min-h-[400px]">
            <Receipt size={48} className="opacity-20 mb-4" />
            <p className="tracking-wider">請在左側選擇桌號</p>
          </div>
        )}
      </div>
    </div>
  );
}
