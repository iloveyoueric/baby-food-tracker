import React, { useState } from 'react';
import { INITIAL_FOODS, CATEGORY_COLORS } from './FoodData';
import { Search, Filter, x } from 'lucide-react';

export default function RecordPage() {
    const [foods, setFoods] = useState(INITIAL_FOODS);
    const [selectedFood, setSelectedFood] = useState(null); // 目前點選要記錄的食材
    const [searchTerm, setSearchTerm] = useState('');

    // 表單狀態
    const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
    const [logMl, setLogMl] = useState('');
    const [hasAllergy, setHasAllergy] = useState(false);

    // 1. 處理儲存紀錄
    const handleSaveRecord = () => {
        if (!logMl || isNaN(logMl)) {
            alert("請輸入正確的食用量 (ml)");
            return;
        }

        const newLog = {
            date: logDate,
            ml: parseInt(logMl),
            reaction: hasAllergy
        };

        setFoods(prevFoods => prevFoods.map(f => {
            if (f.id === selectedFood.id) {
                // 更新該食材：新增 logs 且根據過敏反應更新 status
                return {
                    ...f,
                    logs: [...f.logs, newLog],
                    status: hasAllergy ? 'allergy' : 'safe'
                };
            }
            return f;
        }));

        // 重置表單並關閉彈窗
        setSelectedFood(null);
        setLogMl('');
        setHasAllergy(false);
        alert(`${selectedFood.name} 紀錄已儲存！`);
    };

    const filteredFoods = foods.filter(f => f.name.includes(searchTerm));

    return (
        <div className="min-h-screen bg-[#FFFDF5] p-6 font-mono">
            <h1 className="text-2xl font-black mb-6 text-slate-800">📖 新增食用紀錄</h1>

            {/* 搜尋欄 */}
            <div className="flex items-center gap-2 border-4 border-slate-800 p-3 bg-white mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Search size={20} />
                <input
                    type="text"
                    placeholder="點擊下方食材來記錄..."
                    className="outline-none w-full font-bold"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* 食材選擇區 */}
            <div className="flex flex-wrap gap-3 bg-[#F0F8FF] p-6 border-4 border-slate-800 rounded-2xl">
                {filteredFoods.map(food => (
                    <button
                        key={food.id}
                        onClick={() => setSelectedFood(food)}
                        className={`
              ${CATEGORY_COLORS[food.category]} 
              px-4 py-2 border-4 border-slate-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]
              hover:translate-y-[-2px] active:translate-y-[2px] transition-all
              font-bold text-slate-800
            `}
                    >
                        {food.name}
                    </button>
                ))}
            </div>

            {/* --- 像素風彈窗 (Modal) --- */}
            {selectedFood && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-8 border-slate-800 p-6 w-full max-w-md shadow-[10px_10px_0px_0px_rgba(0,0,0,0.3)] relative">
                        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                            <span className="bg-yellow-200 px-2 border-2 border-slate-800">{selectedFood.name}</span> 的紀錄
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block font-black mb-1">食用日期:</label>
                                <input
                                    type="date"
                                    value={logDate}
                                    onChange={(e) => setLogDate(e.target.value)}
                                    className="w-full border-4 border-slate-800 p-2 outline-none focus:bg-yellow-50"
                                />
                            </div>

                            <div>
                                <label className="block font-black mb-1">食用量 (ml):</label>
                                <input
                                    type="number"
                                    placeholder="例如: 30"
                                    value={logMl}
                                    onChange={(e) => setLogMl(e.target.value)}
                                    className="w-full border-4 border-slate-800 p-2 outline-none focus:bg-yellow-50"
                                />
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="allergy"
                                    checked={hasAllergy}
                                    onChange={(e) => setHasAllergy(e.target.checked)}
                                    className="w-6 h-6 border-4 border-slate-800 cursor-pointer"
                                />
                                <label htmlFor="allergy" className="font-black text-red-600 cursor-pointer">出現過敏反應！</label>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={handleSaveRecord}
                                className="flex-1 bg-green-400 border-4 border-slate-800 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-300"
                            >
                                儲存紀錄
                            </button>
                            <button
                                onClick={() => setSelectedFood(null)}
                                className="flex-1 bg-slate-200 border-4 border-slate-800 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-300"
                            >
                                取消
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}