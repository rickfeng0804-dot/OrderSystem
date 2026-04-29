import React, { useState } from 'react';
import { CATEGORIES, mockMenu } from '../data';
import { MenuItem, OrderItem, SizeOption, AddOnOption } from '../types';
import { ShoppingCart, Plus, Minus, X, Check, QrCode, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderingViewProps {
  storeName: string;
  storeLogo: string;
  activeTables: number[];
  onSubmitOrder: (tableNumber: number, items: OrderItem[], total: number) => void;
}

export default function OrderingView({ storeName, storeLogo, activeTables, onSubmitOrder }: OrderingViewProps) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[1]); // Default to Noodle
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [tableNumber, setTableNumber] = useState<number>(0); 
  const [hasSelectedTable, setHasSelectedTable] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [toastMessage, setToastMessage] = useState<{title: string, desc: string} | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const [justAddedItemId, setJustAddedItemId] = useState<string | null>(null);

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleOpenItemEditor = (item: MenuItem) => {
    setSelectedItem(item);
    setSelectedSize(item.sizes[0] || null);
    setSelectedAddOns([]);
    setQuantity(1);
    setAddedFeedback(false);
  };

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    const defaultSize = item.sizes[0];
    const unitPrice = item.price + (defaultSize?.priceModifier || 0);
    const newItem: OrderItem = {
      id: Math.random().toString(36).substring(7),
      menuId: item.id,
      name: item.name,
      size: defaultSize?.name || '正常',
      addOns: [],
      qty: 1,
      subtotal: unitPrice
    };
    setCart([...cart, newItem]);
    
    setJustAddedItemId(item.id);
    setTimeout(() => setJustAddedItemId(null), 2000);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleToggleAddOn = (addon: AddOnOption) => {
    if (selectedAddOns.find(a => a.name === addon.name)) {
      setSelectedAddOns(selectedAddOns.filter(a => a.name !== addon.name));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const handleAddToCart = () => {
    if (!selectedItem || !selectedSize) return;

    const sizePrice = selectedSize.priceModifier;
    const addOnsPrice = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = selectedItem.price + sizePrice + addOnsPrice;
    
    const newItem: OrderItem = {
      id: Math.random().toString(36).substring(7),
      menuId: selectedItem.id,
      name: selectedItem.name,
      size: selectedSize.name,
      addOns: selectedAddOns.map(a => a.name),
      qty: quantity,
      subtotal: unitPrice * quantity
    };

    setCart([...cart, newItem]);
    
    setAddedFeedback(true);
    setToastMessage({ title: '已加入購物車', desc: `${selectedItem.name} x${quantity}` });
    
    setTimeout(() => {
      setAddedFeedback(false);
      setToastMessage(null);
    }, 2000);
  };

  const isAddOn = activeTables.includes(tableNumber);

  const handleSubmit = () => {
    if (cart.length === 0) return;
    onSubmitOrder(tableNumber, cart, cartTotal);
    setCart([]);
    setIsCartOpen(false);
    
    // Feedback based on order status
    if (isAddOn) {
      alert(`桌號 ${tableNumber} 加點已送出！廚房準備中。`);
    } else {
      alert(`桌號 ${tableNumber} 新訂單已送出！請稍候餐點。`);
    }
  };

  const filteredMenu = mockMenu.filter(m => m.category === activeCategory);

  const handleTableSelect = (table: number) => {
    setTableNumber(table);
    setHasSelectedTable(true);
  };

  const handleMockScan = () => {
    setShowScanner(true);
    setTimeout(() => {
      setShowScanner(false);
      handleTableSelect(Math.floor(Math.random() * 20) + 1);
    }, 1500);
  };

  if (!hasSelectedTable) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[80vh] p-6 max-w-lg mx-auto w-full animate-in fade-in duration-500">
        <div className="text-center mb-10">
          {storeLogo && (
            <img src={storeLogo} alt="Logo" className="w-20 h-20 mx-auto mb-6 rounded-full border border-[#DED9D1] object-cover shadow-sm" />
          )}
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A] mb-2">{storeName}</h2>
          <p className="text-gray-500 text-sm">請選擇您的桌號或掃描桌上的條碼</p>
        </div>

        <div className="w-full space-y-8">
          <button 
            onClick={handleMockScan}
            className="w-full py-5 bg-[#333333] text-white rounded-2xl font-bold tracking-widest text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-3"
          >
            <QrCode size={24} />
            <span>掃描桌號條碼</span>
          </button>

          <div className="relative flex items-center py-2 opacity-70">
            <div className="flex-grow border-t border-[#DED9D1]"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-sm font-medium tracking-widest">或</span>
            <div className="flex-grow border-t border-[#DED9D1]"></div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <h3 className="text-[#1A1A1A] font-bold tracking-wide">手動選擇桌號</h3>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <div className="w-2 h-2 bg-[#BC2732] rounded-full"></div>
                <span>= 用餐中 (可加點)</span>
              </div>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {Array.from({length: 20}, (_, i) => i + 1).map(num => {
                const isOccupied = activeTables.includes(num);
                return (
                  <button
                    key={num}
                    onClick={() => handleTableSelect(num)}
                    className={`relative aspect-square rounded-[20px] flex items-center justify-center text-lg font-bold transition-all shadow-sm active:scale-95 ${
                      isOccupied 
                        ? 'bg-[#F5F2ED] border-2 border-[#DED9D1] text-[#1A1A1A]' 
                        : 'bg-white border border-[#DED9D1] text-[#1A1A1A] hover:bg-gray-50'
                    }`}
                  >
                    {String(num).padStart(2, '0')}
                    {isOccupied && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-[#BC2732] rounded-full shadow-sm" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {showScanner && (
          <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center backdrop-blur-md">
            <div className="w-64 h-64 border-2 border-[rgba(255,255,255,0.1)] rounded-3xl relative flex items-center justify-center overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-transparent to-[#BC2732]/30 animate-pulse"></div>
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#BC2732] shadow-[0_0_20px_rgba(188,39,50,1)]"></div>
              <ScanLine size={48} className="text-white/40" />
            </div>
            <p className="text-white mt-8 tracking-widest text-sm animate-pulse">正在掃描條碼...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-24 max-w-lg mx-auto bg-[#FAF9F6] min-h-screen">
      {/* Header */}
      <header className="pt-4 bg-[#FAF9F6]/90 backdrop-blur-md sticky top-0 z-10 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border-b border-[#F0EBE3]">
        <div className="flex justify-between items-center px-6 mb-2">
          <div className="flex items-center gap-3">
            {storeLogo && (
              <img src={storeLogo} alt="Logo" className="w-8 h-8 rounded-full border border-[#DED9D1] object-cover" />
            )}
            <h1 className="text-xl font-bold tracking-tight text-[#1A1A1A]">{storeName}</h1>
          </div>
          <div className="bg-[#F5F2ED] px-2 py-1 rounded text-xs font-medium text-[#8C7B6C] flex items-center">
            {isAddOn && <span className="w-2 h-2 bg-[#BC2732] rounded-full mr-2"></span>}
            桌號: <select value={tableNumber} onChange={e => setTableNumber(Number(e.target.value))} className="bg-transparent border-none outline-none font-bold text-[#8C7B6C] ml-1 appearance-none cursor-pointer">
              {Array.from({length: 20}, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{String(num).padStart(2, '0')} {activeTables.includes(num) ? '(用餐中)' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto no-scrollbar px-2 relative">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors flex-shrink-0 ${
                  isActive ? 'text-[#1A1A1A]' : 'text-[#8C7B6C] hover:text-[#333333]'
                }`}
              >
                {cat}
                {isActive && (
                  <div className="absolute bottom-0 left-4 right-4 h-[3px] bg-[#BC2732] rounded-t-full shadow-[0_-1px_4px_rgba(188,39,50,0.3)] animate-in fade-in zoom-in-95 duration-200" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Menu List */}
      <div className="px-6 pt-2 space-y-4">
        {filteredMenu.map(item => (
          <div 
            key={item.id} 
            onClick={item.isSoldOut ? undefined : () => handleOpenItemEditor(item)}
            className={`group flex justify-between items-center bg-transparent border-b border-[#F0EBE3] pb-3 transition-transform ${item.isSoldOut ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}`}
          >
            <div className="w-16 h-16 bg-[#F5F2ED] rounded-xl flex items-center justify-center text-3xl shadow-inner border border-[#DED9D1]/50 shrink-0 relative overflow-hidden">
              {item.image}
              {item.isSoldOut && (
                <div className="absolute inset-0 bg-black/10"></div>
              )}
            </div>
            <div className="flex-1 px-4">
              <p className={`font-medium ${item.isSoldOut ? 'text-gray-500 line-through' : 'text-[#1A1A1A]'}`}>{item.name}</p>
              {item.description && <p className={`text-xs mt-1 line-clamp-2 ${item.isSoldOut ? 'text-gray-400' : 'text-gray-500'}`}>{item.description}</p>}
              <div className="flex items-center mt-1">
                <p className={`text-sm font-bold ${item.isSoldOut ? 'text-gray-400' : 'text-[#BC2732]'}`}>${item.price}</p>
                {justAddedItemId === item.id && (
                  <span className="ml-3 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full animate-in slide-in-from-left-2 fade-in shadow-sm">
                    已加入購物車
                  </span>
                )}
              </div>
            </div>
            {item.isSoldOut ? (
              <div className="px-3 py-1 bg-gray-200 rounded-full text-xs font-bold text-gray-500 shrink-0 tracking-widest">
                售完
              </div>
            ) : (
              <button 
                onClick={(e) => handleQuickAdd(e, item)}
                 className="flex items-center gap-1.5 px-3 h-8 bg-[#F5F2ED] hover:bg-[#333333] hover:text-white rounded-full text-xs font-bold text-[#333333] shrink-0 active:scale-95 transition-all shadow-sm opacity-100 translate-x-0 md:opacity-0 md:-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
              >
                <Plus size={14} />
                <span>快速加入</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl overflow-y-auto max-h-[85vh] animate-in slide-in-from-bottom border-t-8 sm:border-[8px] border-[#2A2A2A]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">{selectedItem.name}</h2>
                {selectedItem.description && <p className="text-sm text-gray-500 mt-2 leading-relaxed w-11/12">{selectedItem.description}</p>}
                <p className="text-lg font-bold text-[#BC2732] mt-2">${selectedItem.price}</p>
              </div>
              
              <div className="flex items-center gap-3">
                {cart.length > 0 && (
                  <button 
                    onClick={() => { setSelectedItem(null); setIsCartOpen(true); }}
                    className="flex flex-col items-end pr-2 text-left hover:opacity-80 transition-opacity"
                  >
                    <span className="text-xs text-gray-500 font-bold">目前購物車 ({cart.reduce((s,i)=>s+i.qty,0)})</span>
                    <span className="text-sm font-bold text-[#1A1A1A]">${cartTotal}</span>
                  </button>
                )}
                <button onClick={() => setSelectedItem(null)} className="w-10 h-10 bg-[#F5F2ED] rounded-full flex items-center justify-center text-[#333333]">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Size */}
            {selectedItem.sizes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-[#1A1A1A] mb-3 text-sm">大小份量</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedItem.sizes.map(size => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        selectedSize?.name === size.name 
                          ? 'border-[#333333] ring-1 ring-[#333333] bg-[#F5F2ED] text-[#1A1A1A]' 
                          : 'border-[#F0EBE3] bg-white text-gray-500'
                      }`}
                    >
                      <span className="font-bold">{size.name}</span>
                      <span className="text-xs mt-1">+${size.priceModifier}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add ons */}
            {selectedItem.addOns.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-[#1A1A1A] mb-3 text-sm">加料選項</h4>
                <div className="space-y-2">
                  {selectedItem.addOns.map(addon => {
                    const isSelected = selectedAddOns.some(a => a.name === addon.name);
                    return (
                      <button
                        key={addon.name}
                        onClick={() => handleToggleAddOn(addon)}
                        className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${
                          isSelected ? 'border-[#333333] bg-[#F5F2ED]' : 'border-[#F0EBE3] bg-white text-[#555]'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded flex items-center justify-center ${isSelected ? 'bg-[#333333] border-[#333333] text-white' : 'border-[#DED9D1] bg-white'}`}>
                            {isSelected && <Check size={14} />}
                          </div>
                          <span className="font-medium">{addon.name}</span>
                        </div>
                        <span className="text-sm">+${addon.price}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex justify-between items-center border-b border-[#F0EBE3] pb-6 mb-8">
              <span className="font-medium text-[#1A1A1A] text-sm">數量</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-[#DED9D1] flex items-center justify-center text-sm font-bold text-[#333333] bg-white active:bg-[#F5F2ED]"
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold text-[#1A1A1A] w-4 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-[#F5F2ED] rounded-full flex items-center justify-center text-xl font-bold text-[#333333] active:bg-[#DED9D1]"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={addedFeedback}
              className={`w-full py-4 text-white rounded-xl font-bold tracking-widest text-lg shadow-lg active:scale-95 flex justify-between px-6 transition-all ${addedFeedback ? 'bg-emerald-600' : 'bg-[#333333]'}`}
            >
              {addedFeedback ? (
                <div className="flex items-center justify-center w-full gap-2">
                  <Check size={20} />
                  <span>已加入購物車</span>
                </div>
              ) : (
                <>
                  <span>加入商品</span>
                  <span>${(selectedItem.price + (selectedSize?.priceModifier || 0) + selectedAddOns.reduce((sum, a) => sum + a.price, 0)) * quantity}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40 bg-white sm:max-w-md sm:mx-auto animate-in slide-in-from-bottom">
          <div className="flex flex-col h-full bg-[#FAF9F6]">
            <div className="flex justify-between items-center p-6 bg-white border-b border-[#F0EBE3]">
              <h2 className="text-xl font-bold tracking-tight text-[#1A1A1A]">已點餐點</h2>
              <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 bg-[#F5F2ED] rounded-full flex items-center justify-center text-[#333333]">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {cart.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 my-auto"
                  >
                    <ShoppingCart size={48} className="opacity-20" />
                    <p>購物車是空的</p>
                  </motion.div>
                ) : (
                  cart.map(item => (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, x: 20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -50, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white p-4 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#F0EBE3] w-full"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-[#1A1A1A]">{item.name}</h4>
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-[#BC2732]">${item.subtotal}</p>
                          <button 
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#FAF9F6] text-[#8C7B6C] hover:text-[#BC2732] hover:bg-[#F5F2ED] transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>尺寸: {item.size}</p>
                        {item.addOns.length > 0 && <p>加料: {item.addOns.join(', ')}</p>}
                        <p className="text-[#333333] bg-[#F5F2ED] inline-block px-2 py-0.5 rounded mt-2 font-medium">數量: x{item.qty}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-[#F0EBE3]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">共 {cart.reduce((s, i) => s + i.qty, 0)} 項商品</span>
                  <span className="text-lg font-bold">${cartTotal}</span>
                </div>
                <button 
                  onClick={handleSubmit}
                  className="w-full py-4 bg-[#333333] text-white rounded-xl font-bold tracking-widest text-lg shadow-lg active:scale-95 transition-transform"
                >
                  送出訂單
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {cart.length > 0 && !isCartOpen && !selectedItem && (
        <div className="fixed bottom-6 left-0 right-0 px-4 sm:max-w-md sm:mx-auto z-30">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#333333] text-white py-4 px-6 rounded-xl shadow-lg flex items-center justify-between active:scale-95 transition-transform"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <ShoppingCart size={20} />
              </div>
              <span className="font-bold">{cart.reduce((s, i) => s + i.qty, 0)} 項商品</span>
            </div>
            <span className="font-bold tracking-widest text-lg">${cartTotal}</span>
          </button>
        </div>
      )}
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none">
          <div className="bg-[#333333] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className="bg-[#444] rounded-full p-1">
              <Check size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm tracking-widest">{toastMessage.title}</p>
              <p className="text-xs text-gray-400">{toastMessage.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
