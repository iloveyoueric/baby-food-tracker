import React, { useState, useMemo } from 'react';
import { Search, Calendar, Droplets, AlertTriangle, Check, X } from 'lucide-react';
import { CATEGORY_COLORS } from '../FoodData';
import { FilePenLine, PencilLine } from 'lucide-react';
import { playPixelSound } from '../utils/audio';

export default function RecordPage({ foods, setFoods }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFood, setSelectedFood] = useState(null);

    // 表單狀態
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [ml, setMl] = useState('');
    const [reaction, setReaction] = useState(false);

    // 搜尋過濾邏輯
    const filteredFoods = useMemo(() => {
        if (!searchTerm.trim()) return foods;
        return foods.filter(f =>
            f.name.includes(searchTerm) || f.category.includes(searchTerm)
        );
    }, [foods, searchTerm]);

    // 核心修正：加入防禦性檢查的儲存邏輯，解決 f.logs is not iterable 問題
    const handleSave = () => {
        if (!selectedFood || !ml) {
            alert("請填寫食用量喔！");
            return;
        }

        const newLog = {
            date: date,
            ml: parseInt(ml),
            reaction: reaction
        };

        const updatedFoods = foods.map(f => {
            if (f.id === selectedFood.id) {
                // 防錯關鍵：如果雲端資料沒有 logs 欄位，初始化為空陣列
                const currentLogs = Array.isArray(f.logs) ? f.logs : [];

                // 自動根據反應更新食材狀態
                let newStatus = f.status;
                if (reaction) {
                    newStatus = 'allergy';
                } else if (f.status === 'candidate') {
                    newStatus = 'safe';
                }

                return {
                    ...f,
                    status: newStatus,
                    logs: [...currentLogs, newLog]
                };
            }
            return f;
        });

        playPixelSound.success(); // 觸發成功音效
        // 推送到 Firebase
        setFoods(updatedFoods);

        // 重置狀態
        setSelectedFood(null);
        setMl('');
        setReaction(false);
        alert(`已成功記錄 ${selectedFood.name}！`);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 font-mono">
            <header className="mb-6">
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <span className="bg-yellow-300 border-4 border-slate-800 p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><FilePenLine size={28} /></span>
                    新增食用紀錄
                </h1>
                <p className="text-slate-500 font-bold mt-2 italic">點擊下方方塊，記錄寶寶今天的嘗試吧！</p>
            </header>

            {/* 搜尋列 */}
            <div className="flex items-center gap-3 bg-white border-4 border-slate-800 p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
                <Search size={24} />
                <input
                    type="text"
                    placeholder="搜尋想記錄的食材名稱..."
                    className="flex-1 outline-none text-xl font-bold"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* 全食材攤開區域 (第二張圖的 UI) */}
            {!selectedFood && (
                <div className="bg-[#EBF5FB] border-4 border-slate-800 rounded-[30px] p-6 shadow-[inner_4px_4px_10px_rgba(0,0,0,0.1)]">
                    <div className="flex flex-wrap justify-center gap-3">
                        {filteredFoods.map(f => (
                            <button
                                key={f.id}
                                onClick={() => setSelectedFood(f)}
                                className={`
                                    ${CATEGORY_COLORS[f.category] || 'bg-white'}
                                    px-4 py-2 border-4 border-slate-800 font-black text-slate-700
                                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                    hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                                    active:translate-y-1 active:shadow-none
                                    transition-all min-w-[90px] text-center
                                `}
                            >
                                {f.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 輸入紀錄彈窗 (當點擊食材後顯示) */}
            {selectedFood && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-8 border-slate-800 p-6 w-full max-w-md shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative animate-in zoom-in duration-150">
                        <button
                            onClick={() => setSelectedFood(null)}
                            className="absolute -top-6 -right-6 bg-red-500 border-4 border-slate-800 p-2 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <X size={20} />
                        </button>

                        <div className="bg-slate-800 text-white p-3 -mx-6 -mt-6 mb-6 flex items-center gap-3">
                            <span className="text-xl"><PencilLine size={28} /></span>
                            <h2 className="text-xl font-black italic">記錄「{selectedFood.name}」</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="font-black text-sm text-slate-600 flex items-center gap-2">
                                    <Calendar size={16} /> 食用日期
                                </label>
                                <input
                                    type="date"
                                    className="border-4 border-slate-800 p-3 font-bold outline-none focus:bg-yellow-50"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-black text-sm text-slate-600 flex items-center gap-2">
                                    <Droplets size={16} /> 食用量 (ml)
                                </label>
                                <input
                                    type="number"
                                    className="border-4 border-slate-800 p-3 font-bold outline-none text-2xl"
                                    value={ml}
                                    onChange={(e) => setMl(e.target.value)}
                                />
                            </div>

                            <div
                                onClick={() => setReaction(!reaction)}
                                className={`flex items-center justify-between p-4 border-4 border-slate-800 cursor-pointer transition-all ${reaction ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                            >
                                <div className="flex items-center gap-2 font-black">
                                    <AlertTriangle size={20} /> 是否出現過敏反應？
                                </div>
                                <div className="w-8 h-8 border-4 border-slate-800 bg-white flex items-center justify-center">
                                    {reaction && <Check className="text-red-500" strokeWidth={4} />}
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full bg-green-400 border-4 border-slate-800 py-4 font-black text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                            >
                                確認儲存
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}