import React, { useState, useMemo } from 'react';
import { CATEGORY_COLORS } from '../FoodData';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Calendar, ChartColumnBig } from 'lucide-react';

export default function StatsPage({ foods }) {
    const [viewMode, setViewMode] = useState('food');
    const [expandedFoodId, setExpandedFoodId] = useState(null);

    // --- 邏輯 1: 整理已吃過的食材 (含安全檢查) ---
    const eatenFoods = useMemo(() => {
        if (!foods || !Array.isArray(foods)) return [];

        return foods
            .filter(f => f && f.logs && Array.isArray(f.logs) && f.logs.length > 0)
            .map(f => {
                const sortedLogs = [...f.logs].sort((a, b) => new Date(b.date) - new Date(a.date));
                const totalMl = f.logs.reduce((sum, log) => sum + (parseInt(log.ml) || 0), 0);
                return { ...f, logs: sortedLogs, totalMl };
            })
            .sort((a, b) => b.totalMl - a.totalMl); // 按攝取量排序
    }, [foods]);

    // --- 邏輯 2: 日期歷程 (含安全檢查) ---
    const dailyLogs = useMemo(() => {
        if (!foods || !Array.isArray(foods)) return [];

        const dates = {};
        foods.forEach(food => {
            if (food && food.logs && Array.isArray(food.logs)) {
                food.logs.forEach(log => {
                    if (log && log.date) {
                        if (!dates[log.date]) dates[log.date] = [];
                        dates[log.date].push({
                            ...log,
                            foodName: food.name || '未知食材',
                            category: food.category || '未分類'
                        });
                    }
                });
            }
        });
        return Object.entries(dates).sort((a, b) => new Date(b[0]) - new Date(a[0]));
    }, [foods]);

    const toggleExpand = (id) => {
        setExpandedFoodId(expandedFoodId === id ? null : id);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 animate-in fade-in duration-500 font-mono">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-black text-slate-800 flex items-center justify-center gap-3">
                    <span className="bg-blue-400 border-4 border-slate-800 p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white">
                        <ChartColumnBig size={24} />
                    </span>
                    成長進食數據
                </h1>
                <p className="text-slate-500 font-bold mt-2 italic">追蹤寶寶每一口像素級的成長</p>
            </header>

            {/* 切換按鈕：採用看板同款陰影與邊框 */}
            <div className="flex justify-center mb-10">
                <div className="flex border-4 border-slate-800 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <button
                        onClick={() => setViewMode('food')}
                        className={`px-8 py-2 font-black transition-all ${viewMode === 'food' ? 'bg-slate-800 text-white' : 'bg-white text-slate-400 hover:text-slate-800'}`}
                    >
                        食材統計
                    </button>
                    <button
                        onClick={() => setViewMode('date')}
                        className={`px-8 py-2 font-black border-l-4 border-slate-800 transition-all ${viewMode === 'date' ? 'bg-slate-800 text-white' : 'bg-white text-slate-400 hover:text-slate-800'}`}
                    >
                        每日紀錄
                    </button>
                </div>
            </div>

            {/* --- 模式 1: 食材統計 (強化配色) --- */}
            {viewMode === 'food' && (
                <div className="space-y-4">
                    {eatenFoods.length === 0 ? (
                        <div className="text-center py-20 border-4 border-dashed border-slate-300 font-black text-slate-300 italic bg-white/50">
                            尚無像素紀錄...
                        </div>
                    ) : (
                        eatenFoods.map(food => (
                            <div key={food.id} className="border-4 border-slate-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
                                <div
                                    onClick={() => toggleExpand(food.id)}
                                    className={`p-4 flex flex-col sm:flex-row items-center gap-4 cursor-pointer hover:brightness-95 transition-all ${CATEGORY_COLORS[food.category] || 'bg-white'}`}
                                >
                                    {/* 食材圖示區 */}
                                    <div className="w-16 h-16 bg-white/80 border-4 border-slate-800 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
                                        {food.image ? (
                                            <img src={food.image} alt={food.name} className="w-10 h-10 object-contain" style={{ imageRendering: 'pixelated' }} />
                                        ) : (
                                            <span className="text-2xl">🍱</span>
                                        )}
                                    </div>

                                    {/* 數據進度條：模擬 8-bit 血條感 */}
                                    <div className="flex-1 w-full space-y-1">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xl font-black text-slate-800">{food.name}</span>
                                            <span className="text-xs font-black bg-slate-800 text-white px-2 py-0.5 mb-1">{food.totalMl} ml</span>
                                        </div>
                                        <div className="h-4 border-4 border-slate-800 bg-white/50 relative overflow-hidden">
                                            <div
                                                className="h-full bg-slate-800 transition-all duration-500"
                                                style={{ width: `${Math.min((food.totalMl / 500) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* 次數標籤 */}
                                    <div className="flex items-center gap-2">
                                        <span className="bg-white border-4 border-slate-800 px-3 py-1 text-xs font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                                            {food.logs.length} Hits {expandedFoodId === food.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </span>
                                        {food.status === 'allergy' && <AlertCircle className="text-red-600 animate-bounce" size={24} />}
                                    </div>
                                </div>

                                {/* 展開的歷史紀錄清單 */}
                                {expandedFoodId === food.id && (
                                    <div className="bg-slate-50 border-t-4 border-slate-800 p-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                        {food.logs.map((log, index) => (
                                            <div key={index} className={`flex justify-between items-center p-3 border-2 border-slate-800 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${log.reaction ? 'border-red-500' : ''}`}>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    <span className="text-sm font-black text-slate-600">{log.date}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-black text-lg italic">{log.ml}ml</span>
                                                    {log.reaction ? (
                                                        <span className="bg-red-500 text-white text-[8px] px-2 py-1 font-black border-2 border-slate-900">CRITICAL</span>
                                                    ) : (
                                                        <CheckCircle2 size={16} className="text-green-500" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* --- 模式 2: 每日紀錄 (強化類別色彩) --- */}
            {viewMode === 'date' && (
                <div className="space-y-6">
                    {dailyLogs.length === 0 ? (
                        <div className="text-center py-20 border-4 border-dashed border-slate-300 font-black text-slate-300 italic bg-white/50">
                            暫無冒險日誌...
                        </div>
                    ) : (
                        dailyLogs.map(([date, items]) => (
                            <div key={date} className="bg-white border-4 border-slate-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                <div className="bg-slate-800 text-white px-4 py-2 font-black flex justify-between items-center">
                                    <span className="italic tracking-widest">DATE: {date}</span>
                                    <span className="text-[10px] opacity-70">LV. {items.length} EATEN</span>
                                </div>
                                <div className="p-4 flex flex-wrap gap-3">
                                    {items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`${CATEGORY_COLORS[item.category] || 'bg-slate-100'} px-4 py-2 border-4 border-slate-800 font-black text-sm shadow-[3px_3px_0px_0px_rgba(15,23,42,0.1)] flex items-center gap-2 hover:-translate-y-1 transition-transform`}
                                        >
                                            <span className="border-r-2 border-slate-800/20 pr-2">{item.foodName}</span>
                                            <span className="italic">{item.ml}ml</span>
                                            {item.reaction && <AlertCircle size={14} className="text-red-600 animate-pulse" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}