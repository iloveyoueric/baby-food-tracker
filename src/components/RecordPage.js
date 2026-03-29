import React, { useState, useMemo } from 'react';
import { Search, Calendar, Droplets, AlertTriangle, Check, X, FilePenLine, PencilLine, CircleCheckBig, TriangleAlert, Refrigerator } from 'lucide-react';
import { CATEGORY_COLORS } from '../FoodData';
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

    // 儲存紀錄邏輯 (維持嚴格過敏判斷)
    const handleSave = () => {
        if (!selectedFood || !ml) {
            alert("請填寫食用量喔！");
            return;
        }

        if (isNaN(parseInt(ml)) || parseInt(ml) <= 0) {
            alert("請輸入有效的食用量（數字）！");
            return;
        }

        const newLog = {
            date: date,
            ml: parseInt(ml),
            reaction: reaction
        };

        const updatedFoods = foods.map(f => {
            if (f.id === selectedFood.id) {
                const currentLogs = Array.isArray(f.logs) ? f.logs : [];
                // 1. 合併新舊紀錄
                const allLogs = [...currentLogs, newLog];

                // 2. 核心邏輯：曾經有過過敏 (hasEverHadAllergy)，狀態就是 allergy (注意中)
                const hasEverHadAllergy = allLogs.some(log => log.reaction === true);

                let newStatus;
                if (hasEverHadAllergy) {
                    newStatus = 'allergy';
                } else {
                    // 全數紀錄都沒有過敏反應，才是已過關
                    newStatus = 'safe';
                }

                return { ...f, status: newStatus, logs: allLogs };
            }
            return f;
        });

        playPixelSound.success();
        setFoods(updatedFoods);

        // 重置表單
        setSelectedFood(null);
        setSearchTerm('');
        setMl('');
        setReaction(false);
        alert(`已成功記錄 ${selectedFood.name}！`);
    };

    // 食材方塊組件
    const FoodTile = ({ food }) => (
        <button
            onClick={() => { playPixelSound.click(); setSelectedFood(food); }}
            className={`
                ${CATEGORY_COLORS[food.category] || 'bg-white'}
                w-[calc(33.33%-0.5rem)] sm:w-[100px] 
                min-h-[50px] px-1 py-2 
                border-[3px] sm:border-4 border-slate-800 
                shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] 
                hover:-translate-y-1 active:translate-y-1 active:shadow-none 
                transition-all 
                text-[11px] sm:text-sm font-black text-slate-700 break-all leading-tight overflow-hidden
            `}
        >
            {food.name}
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto p-4 font-mono relative">
            <header className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-3">
                    <span className="bg-yellow-300 border-[3px] sm:border-4 border-slate-800 p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <FilePenLine className="w-6 h-6 sm:w-7 sm:h-7" />
                    </span>
                    新增食用紀錄
                </h1>
                <p className="text-slate-500 font-bold mt-2 italic text-xs sm:text-sm">點擊下方方塊，記錄今天的嘗試吧！</p>
            </header>

            {/* 食材列表區域 (彈窗開啟時背景維持顯示) */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 bg-white border-[3px] sm:border-4 border-slate-800 p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                    <input
                        type="text"
                        placeholder="搜尋食材名稱..."
                        className="flex-1 outline-none text-lg sm:text-xl font-bold bg-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-[#EBF5FB] border-[3px] sm:border-4 border-slate-800 rounded-[20px] sm:rounded-[30px] p-4 sm:p-8 shadow-[inner_4px_4px_10px_rgba(0,0,0,0.1)]">
                    {['safe', 'allergy', 'candidate'].map(statusId => {
                        // 1. 容錯型過濾邏輯
                        let sectionFoods = filteredFoods.filter(f => {
                            if (statusId === 'safe') return f.status === 'safe';
                            if (statusId === 'allergy') return f.status === 'allergy';
                            if (statusId === 'candidate') {
                                return f.status === 'candidate' || !['safe', 'allergy'].includes(f.status);
                            }
                            return false;
                        });

                        // 2. 核心修改：如果是「待嘗試」區域，依照類別進行排序
                        if (statusId === 'candidate') {
                            sectionFoods = [...sectionFoods].sort((a, b) => {
                                // 先依照類別排序
                                if (a.category < b.category) return -1;
                                if (a.category > b.category) return 1;
                                // 同類別時，依照名稱排序 (中文字符排序)
                                return a.name.localeCompare(b.name, 'zh-Hant');
                            });
                        }

                        if (sectionFoods.length === 0) return null;

                        const statusConfig = {
                            safe: { icon: <CircleCheckBig size={18} />, title: '已過關' },
                            allergy: { icon: <TriangleAlert size={18} />, title: '注意中' },
                            candidate: { icon: <Refrigerator size={18} />, title: '待嘗試' },
                        };
                        const { icon, title } = statusConfig[statusId];

                        return (
                            <div key={statusId} className="mb-8 last:mb-0">
                                <h2 className="font-black text-slate-400 mb-3 uppercase text-[10px] sm:text-xs tracking-[0.2em] border-b-2 border-slate-200 flex items-center gap-2">
                                    {icon}
                                    {title}
                                </h2>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    {sectionFoods.map(f => <FoodTile key={f.id} food={f} />)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 紀錄輸入彈窗 (fixed, backdrop-blur) */}
            {selectedFood && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedFood(null)}
                >
                    <div
                        className="bg-white border-[6px] sm:border-8 border-slate-800 p-5 sm:p-6 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative animate-in zoom-in duration-150"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedFood(null)}
                            className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-red-500 border-[3px] sm:border-4 border-slate-800 p-2 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                        >
                            <X size={20} />
                        </button>

                        <div className="bg-slate-800 text-white p-3 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 mb-6 flex items-center gap-3 italic">
                            <PencilLine className="w-5 h-5 sm:w-6 sm:h-7" />
                            <h2 className="text-lg sm:text-xl font-black truncate">記錄「{selectedFood.name}」</h2>
                        </div>

                        <div className="space-y-5 text-left">
                            <div className="flex flex-col gap-1">
                                <label className="font-black text-xs sm:text-sm text-slate-600 flex items-center gap-2">
                                    <Calendar size={14} /> 食用日期
                                </label>
                                <input
                                    type="date"
                                    className="border-[3px] sm:border-4 border-slate-800 p-2 sm:p-3 font-bold outline-none focus:bg-yellow-50"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="font-black text-xs sm:text-sm text-slate-600 flex items-center gap-2">
                                    <Droplets size={14} /> 食用量 (ml)
                                </label>
                                <input
                                    type="number"
                                    className="border-[3px] sm:border-4 border-slate-800 p-2 sm:p-3 font-bold text-xl outline-none focus:bg-yellow-50"
                                    value={ml}
                                    onChange={(e) => setMl(e.target.value)}
                                />
                            </div>

                            <div
                                onClick={() => setReaction(!reaction)}
                                className={`flex items-center justify-between p-3 sm:p-4 border-[3px] sm:border-4 border-slate-800 cursor-pointer transition-all ${reaction ? 'bg-red-500 text-white shadow-[inset_4px_4px_0px_rgba(0,0,0,0.2)]' : 'bg-slate-100'}`}
                            >
                                <div className="flex items-center gap-2 font-black text-sm sm:text-base">
                                    <AlertTriangle size={18} /> 是否過敏？
                                </div>
                                <div className="w-6 h-6 sm:w-8 sm:h-8 border-[3px] sm:border-4 border-slate-800 bg-white flex items-center justify-center">
                                    {reaction && <Check className="text-red-500" strokeWidth={4} size={16} />}
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full bg-green-400 border-[3px] sm:border-4 border-slate-800 py-3 sm:py-4 font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
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