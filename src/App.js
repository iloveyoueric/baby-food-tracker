import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, onValue, set } from "firebase/database";
import { INITIAL_FOODS } from './FoodData';
import HomePage from './components/HomePage';
import RecordPage from './components/RecordPage';
import StatsPage from './components/StatsPage';

// 1. 引入你指定的新圖示
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
      if (data) {
        setFoods(data);
      } else {
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

  // 導覽按鈕的通用樣式
  const navBtnClass = (page) => `
    flex flex-col items-center justify-center gap-1 w-20 h-20 
    border-4 border-slate-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
    active:translate-y-1 active:shadow-none
    ${activePage === page ? 'bg-yellow-300' : 'bg-white hover:bg-slate-50'}
  `;

  return (
    <div className="flex min-h-screen bg-[#FFFDF5] font-mono">
      {/* 左側導覽列 */}
      <nav className="w-28 border-r-8 border-slate-800 bg-white flex flex-col items-center py-8 gap-6 sticky top-0 h-screen">

        {/* 1. Baby 圖示 (個人主頁/寶寶資訊 - 假設你未來想擴充或作為 Logo) */}
        <div className="mb-4 p-2 bg-slate-800 text-white border-4 border-slate-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
          <Baby size={32} strokeWidth={2.5} />
        </div>

        <div className="flex flex-col gap-4">
          {/* 2. House 圖示 (主頁看板) */}
          <button
            onClick={() => { playPixelSound.click(); setActivePage('home'); }}
            className={navBtnClass('home')}
          >
            <House size={28} />
            <span className="text-[10px] font-bold">預覽</span>
          </button>

          {/* 3. FilePenLine 圖示 (新增紀錄) */}
          <button
            onClick={() => { playPixelSound.click(); setActivePage('record'); }}
            className={navBtnClass('record')}
          >
            <FilePenLine size={28} />
            <span className="text-[10px] font-bold">紀錄</span>
          </button>

          {/* 4. ChartColumnBig 圖示 (成長數據) */}
          <button
            onClick={() => { playPixelSound.click(); setActivePage('stats'); }}
            className={navBtnClass('stats')}
          >
            <ChartColumnBig size={28} />
            <span className="text-[10px] font-bold">數據</span>
          </button>
        </div>
      </nav>

      {/* 右側內容區 */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activePage === 'home' && <HomePage foods={foods} setFoods={updateFoods} />}
        {activePage === 'record' && <RecordPage foods={foods} setFoods={updateFoods} />}
        {activePage === 'stats' && <StatsPage foods={foods} />}
      </main>
    </div>
  );
}