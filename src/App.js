import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, onValue, set } from "firebase/database";
import { INITIAL_FOODS } from './FoodData';
import HomePage from './components/HomePage';
import RecordPage from './components/RecordPage';
import StatsPage from './components/StatsPage';

// 保持您原本的圖示與音效
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
        // --- 核心修正：自動同步 Firebase 與 FoodData 的定義 ---

        // 1. 過濾掉想要刪除的食材：母乳、配方奶
        let updatedData = data.filter(f => f.name !== '母乳' && f.name !== '配方奶');

        // 2. 檢查是否需要新增「白麵」
        const hasNoodles = updatedData.some(f => f.name === '白麵');
        if (!hasNoodles) {
          const noodleObj = INITIAL_FOODS.find(f => f.name === '白麵');
          if (noodleObj) {
            updatedData.push(noodleObj);
          }
        }

        // 3. 如果資料有變動（例如刪了奶或加了麵），寫回 Firebase
        if (updatedData.length !== data.length) {
          set(foodRef, updatedData);
        }

        setFoods(updatedData);
      } else {
        // 如果資料庫完全沒東西，初始化
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
      {/* 左側導覽列 - 維持您的風格 */}
      <nav className="w-28 border-r-8 border-slate-800 bg-white flex flex-col items-center py-8 gap-6 sticky top-0 h-screen">

        <div className="mb-4 p-2 bg-slate-800 text-white border-4 border-slate-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
          <Baby size={32} strokeWidth={2.5} />
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => { playPixelSound.click(); setActivePage('home'); }}
            className={navBtnClass('home')}
          >
            <House size={28} />
            <span className="text-[10px] font-bold">預覽</span>
          </button>

          <button
            onClick={() => { playPixelSound.click(); setActivePage('record'); }}
            className={navBtnClass('record')}
          >
            <FilePenLine size={28} />
            <span className="text-[10px] font-bold">紀錄</span>
          </button>

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