// src/App.js 完整修正版

import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, onValue, set } from "firebase/database";
import { INITIAL_FOODS } from './FoodData';
import HomePage from './components/HomePage';
import RecordPage from './components/RecordPage';
import StatsPage from './components/StatsPage';
import { Baby, House, FilePenLine, ChartColumnBig } from 'lucide-react';
import { playPixelSound } from './utils/audio';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foodRef = ref(db, 'foods');
    const unsubscribe = onValue(foodRef, (snapshot) => {
      const data = snapshot.val();

      if (data && Array.isArray(data)) {
        let needsUpdate = false;

        // --- 核心修正：強制同步「名稱」與「圖片路徑」與最新定義 ---
        const updatedData = data.map(dbFood => {
          // 找尋 FoodData.js 中對應 ID 的最新定義 (例如 s10 會找到章魚)
          const latestDef = INITIAL_FOODS.find(f => f.id === dbFood.id);

          if (latestDef) {
            // 檢查名稱或圖片是否與最新定義不符
            // 使用 || null 確保如果圖片找不到時不會出現 undefined 導致 Firebase 報錯
            const hasNameChanged = dbFood.name !== latestDef.name;
            const hasImageChanged = dbFood.image !== (latestDef.image || null);

            if (hasNameChanged || hasImageChanged) {
              needsUpdate = true;
              return {
                ...dbFood,
                name: latestDef.name,
                image: latestDef.image || null
              };
            }
          }
          return dbFood;
        });

        // 檢查是否有需要移除的舊食材 (母乳/配方奶)
        let finalData = updatedData.filter(f => f.name !== '母乳' && f.name !== '配方奶');

        // 檢查是否有遺漏的新食材 (例如白麵)
        INITIAL_FOODS.forEach(initFood => {
          const exists = finalData.some(f => f.id === initFood.id);
          if (!exists) {
            finalData.push(initFood);
            needsUpdate = true;
          }
        });

        // 如果偵測到任何名稱、圖片或結構變更，自動寫回 Firebase
        if (needsUpdate || finalData.length !== data.length) {
          console.log("偵測到配置或名稱變更 (如：章魚)，正在同步 Firebase 資料庫...");
          set(foodRef, finalData);
        }

        setFoods(finalData);
      } else {
        // 資料庫為空時的初始化
        set(foodRef, INITIAL_FOODS);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateFoods = (newFoods) => {
    setFoods(newFoods);
    set(ref(db, 'foods'), newFoods);
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center font-black animate-pulse text-slate-400">
      LOADING PIXELS...
    </div>
  );

  const navBtnClass = (page) => `
    flex flex-col items-center justify-center gap-1 w-20 h-20 
    border-4 border-slate-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
    active:translate-y-1 active:shadow-none
    ${activePage === page ? 'bg-yellow-300' : 'bg-white hover:bg-slate-50'}
  `;

  return (
    <div className="flex min-h-screen bg-[#FFFDF5] font-mono">
      {/* 側邊導覽列 */}
      <nav className="w-28 border-r-8 border-slate-800 bg-white flex flex-col items-center py-8 gap-6 sticky top-0 h-screen">
        <div className="mb-4 p-2 bg-slate-800 text-white border-4 border-slate-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
          <Baby size={32} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-4">
          <button onClick={() => { playPixelSound.click(); setActivePage('home'); }} className={navBtnClass('home')}>
            <House size={28} /><span className="text-[10px] font-bold">預覽</span>
          </button>
          <button onClick={() => { playPixelSound.click(); setActivePage('record'); }} className={navBtnClass('record')}>
            <FilePenLine size={28} /><span className="text-[10px] font-bold">紀錄</span>
          </button>
          <button onClick={() => { playPixelSound.click(); setActivePage('stats'); }} className={navBtnClass('stats')}>
            <ChartColumnBig size={28} /><span className="text-[10px] font-bold">數據</span>
          </button>
        </div>
      </nav>

      {/* 內容區 */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activePage === 'home' && <HomePage foods={foods} setFoods={updateFoods} />}
        {activePage === 'record' && <RecordPage foods={foods} setFoods={updateFoods} />}
        {activePage === 'stats' && <StatsPage foods={foods} />}
      </main>
    </div>
  );
}