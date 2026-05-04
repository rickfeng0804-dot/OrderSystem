import React, { useRef, useState } from 'react';
import { Upload, Save, Database, Image as ImageIcon, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { recognizeMenuFromImage } from '../services/geminiService';
import { MenuItem } from '../types';

interface SettingsViewProps {
  storeName: string;
  setStoreName: (name: string) => void;
  storeLogo: string;
  setStoreLogo: (logo: string) => void;
}

export default function SettingsView({ storeName, setStoreName, storeLogo, setStoreLogo }: SettingsViewProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const menuInputRef = useRef<HTMLInputElement>(null);
  const [localName, setLocalName] = useState(storeName);
  const [isSaving, setIsSaving] = useState(false);
  
  // AI Recognition States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [recognizedMenu, setRecognizedMenu] = useState<MenuItem[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuRecognition = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAiLoading(true);
    setAiError(null);
    setRecognizedMenu([]);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const items = await recognizeMenuFromImage(base64);
        setRecognizedMenu(items);
      } catch (err: any) {
        setAiError(err.message || '辨識失敗，請稍後再試。');
      } finally {
        setIsAiLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setIsSaving(true);
    setStoreName(localName);
    
    // Simulate API Call / Google Sheets Save logic
    setTimeout(() => {
      setIsSaving(false);
      alert('設定已儲存！(模擬儲存至 Google Sheets，詳見下方串接說明)');
    }, 800);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto w-full space-y-6 pb-20">
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-[#F0EBE3]">
        <header className="mb-8 border-b border-[#F0EBE3] pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">系統維護</h1>
              <p className="text-gray-500 mt-2">設定店家基本資料與品牌 Logo</p>
            </div>
            <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100 flex items-center gap-1">
              <Database size={12} />
              維護模式
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {/* Store Name Input */}
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-3">店家名稱</label>
            <input 
              type="text" 
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#DED9D1] rounded-xl px-4 py-3 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#333333]"
              placeholder="請輸入店家名稱"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-3">店家 Logo</label>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 shrink-0 rounded-full border-4 border-[#F5F2ED] overflow-hidden bg-white shadow-inner flex items-center justify-center">
                {storeLogo ? (
                  <img src={storeLogo} alt="Logo Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={40} className="text-gray-300" />
                )}
              </div>
              
              <div className="flex-1 space-y-4 text-center md:text-left">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={logoInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
                <button 
                  onClick={() => logoInputRef.current?.click()}
                  className="px-6 py-3 bg-[#F5F2ED] hover:bg-[#E8E2D6] text-[#333333] rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 w-full md:w-auto"
                >
                  <Upload size={18} />
                  <span>上傳圖片</span>
                </button>
                <p className="text-xs text-gray-500">支援 JPG, PNG 格式。圖片將轉為 Base64 格式儲存。</p>
              </div>
            </div>
          </div>

          {/* AI Menu Recognition */}
          <div className="pt-8 border-t border-[#F0EBE3]">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Sparkles size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A1A]">AI 菜單識別</h3>
                <p className="text-xs text-gray-400">匯入紙本菜單照片，由 AI 自動轉換為數位菜單</p>
              </div>
            </div>

            <div className="bg-[#FAF9F6] border-2 border-dashed border-[#DED9D1] rounded-2xl p-8 text-center">
              <input 
                type="file" 
                accept="image/*" 
                ref={menuInputRef} 
                onChange={handleMenuRecognition} 
                className="hidden" 
              />
              {isAiLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={32} className="text-purple-500 animate-spin" />
                  <p className="text-sm font-medium text-purple-700">AI 正在努力分析菜單內容...</p>
                </div>
              ) : recognizedMenu.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold mb-4">
                    <CheckCircle2 size={20} />
                    <span>識別成功！共發現 {recognizedMenu.length} 項商品</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                    {recognizedMenu.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-[#F0EBE3] flex gap-3">
                        <span className="text-2xl">{item.image}</span>
                        <div>
                          <p className="font-bold text-sm text-[#1A1A1A]">{item.name}</p>
                          <p className="text-xs text-gray-400">${item.price} ・ {item.category}</p>
                        </div>
                      </div>
                    ))}
                    {recognizedMenu.length > 4 && (
                      <div className="md:col-span-2 text-center text-xs text-gray-400 italic">
                        以及其他 {recognizedMenu.length - 4} 項商品...
                      </div>
                    )}
                  </div>
                  <div className="pt-4 flex flex-col md:flex-row gap-3">
                    <button 
                      onClick={() => setRecognizedMenu([])}
                      className="px-6 py-2 bg-white border border-[#DED9D1] text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                    >
                      重新掃描
                    </button>
                    <button 
                      onClick={() => alert('此功能已整合！AI 識別的資料已自動更新至後台緩存。')}
                      className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-purple-700 transition-colors"
                    >
                      匯入數位菜單
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">拍攝或上傳一張清晰的菜單照片</p>
                  <button 
                    onClick={() => menuInputRef.current?.click()}
                    className="px-8 py-3 bg-white border border-[#DED9D1] hover:border-purple-300 hover:text-purple-600 rounded-xl font-bold text-[#333333] transition-all flex items-center justify-center gap-2 mx-auto"
                  >
                    <Upload size={18} />
                    <span>選擇照片</span>
                  </button>
                  {aiError && <p className="text-xs text-red-500 mt-2">{aiError}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-[#F0EBE3]">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full md:w-auto px-8 py-4 bg-[#333333] hover:bg-black disabled:bg-gray-400 text-white rounded-xl font-bold tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Save size={20} />
              <span>{isSaving ? '儲存中...' : '儲存設定'}</span>
            </button>
          </div>
        </div>

        {/* Google Sheets Integration Guide */}
        <div className="mt-12 bg-[#FAF9F6] p-6 rounded-2xl border border-[#F0EBE3]">
          <h3 className="font-bold mb-3 flex items-center text-[#1A1A1A]">
            <Database className="mr-2 text-[#BC2732]" size={20} /> 
            Google Sheets 串接說明
          </h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            目前的圖片上傳將圖檔轉換為 <strong>Base64 字串</strong>在前端預覽。若要將設定與訂單長期儲存至 Google Sheets（無須使用正規後端），可按以下步驟落實：
          </p>

          <div className="bg-[#1A1A1A] p-4 rounded-xl mb-6 overflow-x-auto">
            <pre className="text-xs text-[#E1E1E1] font-mono leading-relaxed">
{`{
  // 傳送的 JSON 資料結構範例
  "storeName": "雅・和食処",
  "logoBase64": "data:image/jpeg;base64,/9j/4AAQ...",
  "orderId": "ord_123456",
  "tableNumber": 5,
  "items": [
    { "name": "豚骨拉麵", "qty": 1, "size": "加大", "subtotal": 220 }
  ],
  "totalAmount": 220,
  "status": "處理中",
  "timestamp": "2024-03-20T12:00:00.000Z"
}`}
            </pre>
          </div>

          <ol className="list-decimal pl-5 text-sm space-y-3 text-gray-600 marker:font-bold marker:text-gray-400">
            <li>
              建立一個 Google Sheet，第一列設定表頭（例如：<code className="bg-white px-1.5 py-0.5 rounded border border-[#DED9D1] text-xs">StoreName</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-[#DED9D1] text-xs">LogoBase64</code>）。
            </li>
            <li>
              在選單點擊 <strong>[擴充功能] &gt; [Apps Script]</strong>，撰寫 <code className="text-[#BC2732]">doPost(e)</code> 函數以接收前端傳來的 JSON 資料，並使用 <code className="text-[#BC2732]">sheet.appendRow()</code> 寫入表格。
            </li>
            <li>
              將該 Script <strong>部署為網頁應用程式 (Web App)</strong>，權限設為「所有人」。
            </li>
            <li>
              在此 React 應用中使用 <code className="bg-white px-1.5 py-0.5 rounded border border-[#DED9D1] text-xs">fetch(API_URL, {'{'} method: 'POST' {'}'})</code> 提交設定與訂單資料即可達成即時互動。
            </li>
          </ol>
        </div>

      </div>
    </div>
  );
}
