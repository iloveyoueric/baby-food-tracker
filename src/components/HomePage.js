import React, { useState, useMemo } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Search, Filter, Plus, X, Clock, Trash2, CircleCheckBig, TriangleAlert, Refrigerator } from 'lucide-react';
import { CATEGORY_COLORS } from '../FoodData';
import { playPixelSound } from '../utils/audio'; // 確保此路徑正確指向你的音效工具

// --- 子元件：食材小方塊 (FoodBlock) ---
function FoodBlock({ food, onDoubleClick }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: food.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 1,
        touchAction: 'none',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onDoubleClick={() => onDoubleClick(food)}
            className={`
                ${CATEGORY_COLORS[food.category] || 'bg-white'} 
                w-20 h-28 m-1 p-2 border-4 border-slate-800 
                shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]
                flex flex-col items-center justify-center cursor-grab active:cursor-grabbing
                hover:scale-105 transition-transform select-none relative
            `}
        >
            <div className="w-12 h-12 flex items-center justify-center mb-1">
                {food.image ? (
                    <img
                        src={food.image}
                        alt={food.name}
                        className="w-full h-full object-contain"
                        style={{ imageRendering: 'pixelated' }}
                    />
                ) : (
                    <span className="text-2xl">🍱</span>
                )}
            </div>
            <span className="text-[10px] font-black text-slate-800 text-center leading-tight">
                {food.name}
            </span>
        </div>
    );
}

// --- 主頁面元件 (HomePage) ---
export default function HomePage({ foods, setFoods }) {
    const [filterCat, setFilterCat] = useState('全部');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFoodForModal, setSelectedFoodForModal] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [newFoodName, setNewFoodName] = useState('');
    const [newFoodCat, setNewFoodCat] = useState('主食');

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const filteredFoods = useMemo(() => {
        return foods.filter(f =>
            (filterCat === '全部' || f.category === filterCat) &&
            f.name.includes(searchTerm)
        );
    }, [foods, filterCat, searchTerm]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;
        const activeId = active.id;
        const overContainerId = over.id;
        if (['safe', 'allergy', 'candidate'].includes(overContainerId)) {
            setFoods(prev => prev.map(f => f.id === activeId ? { ...f, status: overContainerId } : f));
        }
    };

    // 刪除單筆紀錄邏輯：若紀錄刪光則自動移回「待嘗試」
    const handleDeleteLog = (foodId, logIndex) => {
        if (window.confirm("確定要刪除這筆食用紀錄嗎？")) {
            playPixelSound.delete();
            const updatedFoods = foods.map(f => {
                if (f.id === foodId) {
                    const currentLogs = Array.isArray(f.logs) ? f.logs : [];
                    const newLogs = [...currentLogs];
                    newLogs.splice(logIndex, 1);
                    const newStatus = newLogs.length === 0 ? 'candidate' : f.status;
                    return { ...f, logs: newLogs, status: newStatus };
                }
                return f;
            });
            setFoods(updatedFoods);
            const updatedFood = updatedFoods.find(f => f.id === foodId);
            setSelectedFoodForModal(updatedFood);
        }
    };

    // 刪除自定義食材功能
    const handleDeleteCustomFood = (id) => {
        if (window.confirm("確定要永久刪除這個自定義食材嗎？")) {
            playPixelSound.delete();
            setFoods(foods.filter(f => f.id !== id));
            setSelectedFoodForModal(null);
        }
    };

    const handleAddNewFood = () => {
        if (!newFoodName.trim()) return;
        playPixelSound.success();
        const categoryDefaultImg = foods.find(f => f.category === newFoodCat && f.image)?.image;
        const newFoodObj = {
            id: `custom_${Date.now()}`,
            name: newFoodName,
            category: newFoodCat,
            status: 'candidate',
            logs: [],
            image: categoryDefaultImg || null
        };
        setFoods([...foods, newFoodObj]);
        setNewFoodName('');
        setIsAddModalOpen(false);
    };

    const renderArea = (id, title, bgColor, textColor, icon) => {
        const sectionFoods = filteredFoods.filter(f => f.status === id);
        return (
            <div className={`mb-6 p-4 border-4 border-slate-800 rounded-2xl ${bgColor}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-lg font-black inline-block px-4 py-1 border-2 border-slate-800 rounded-full bg-white ${textColor} flex items-center gap-2`}>
                        {icon}
                        {title} ({sectionFoods.length})
                    </h2>
                </div>
                <SortableContext id={id} items={sectionFoods.map(f => f.id)} strategy={rectSortingStrategy}>
                    <div className="flex flex-wrap gap-2 min-h-[120px]">
                        {sectionFoods.map(food => (
                            <FoodBlock
                                key={food.id}
                                food={food}
                                onDoubleClick={(f) => {
                                    playPixelSound.click();
                                    setSelectedFoodForModal(f);
                                }}
                            />
                        ))}
                    </div>
                </SortableContext>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 font-mono">
            {/* 工具列 */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 border-4 border-slate-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative z-10">
                <div className="flex items-center gap-2 border-2 border-slate-800 px-3 py-2 bg-slate-50 flex-1">
                    <Filter size={20} />
                    <select className="outline-none bg-transparent font-bold cursor-pointer" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
                        <option value="全部">全部類別</option>
                        {Object.keys(CATEGORY_COLORS).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2 border-2 border-slate-800 px-3 py-2 flex-[2]">
                    <Search size={20} />
                    <input type="text" placeholder="搜尋食材..." className="outline-none w-full font-bold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <button
                    onClick={() => {
                        playPixelSound.click();
                        setIsAddModalOpen(true);
                    }}
                    className="bg-yellow-300 border-4 border-slate-800 px-4 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-200 flex items-center gap-2 active:translate-y-1 active:shadow-none transition-all"
                >
                    <Plus size={20} /> 新增食材
                </button>
            </div>

            {/* 看板主體 */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                {renderArea('safe', '已過關', 'bg-[#F0FFF0]', 'text-green-700', <CircleCheckBig size={20} />)}
                {renderArea('allergy', '注意中', 'bg-[#FFE4E1]', 'text-red-700', <TriangleAlert size={20} />)}
                {renderArea('candidate', '待嘗試', 'bg-[#F0F8FF]', 'text-blue-700', <Refrigerator size={20} />)}
            </DndContext>

            {/* 新增食材彈窗 */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" onClick={() => setIsAddModalOpen(false)}>
                    <div className="bg-white border-8 border-slate-800 p-6 w-full max-w-sm shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-black mb-4 tracking-tighter italic text-slate-800"> 新增私房食材</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="食材名稱" className="w-full border-4 border-slate-800 p-2 font-bold focus:bg-yellow-50 outline-none" value={newFoodName} onChange={(e) => setNewFoodName(e.target.value)} />
                            <select className="w-full border-4 border-slate-800 p-2 font-bold cursor-pointer" value={newFoodCat} onChange={(e) => setNewFoodCat(e.target.value)}>
                                {Object.keys(CATEGORY_COLORS).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button onClick={handleAddNewFood} className="flex-1 bg-green-400 border-4 border-slate-800 py-2 font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1">加入</button>
                            <button onClick={() => { playPixelSound.click(); setIsAddModalOpen(false); }} className="flex-1 bg-slate-200 border-4 border-slate-800 py-2 font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 text-slate-500">取消</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 食材詳情彈窗 */}
            {selectedFoodForModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedFoodForModal(null)}>
                    <div className="bg-white border-8 border-slate-800 p-6 w-full max-w-lg shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => { playPixelSound.click(); setSelectedFoodForModal(null); }} className="absolute -top-4 -right-4 bg-red-500 border-4 border-slate-800 p-1 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-400"><X /></button>

                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 border-4 border-slate-800 flex items-center gap-4 ${CATEGORY_COLORS[selectedFoodForModal.category]}`}>
                                <div className="w-16 h-16 bg-white/50 border-2 border-slate-800 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                                    {selectedFoodForModal.image ? (
                                        <img src={selectedFoodForModal.image} alt={selectedFoodForModal.name} className="w-12 h-12 object-contain" style={{ imageRendering: 'pixelated' }} />
                                    ) : (
                                        <span className="text-3xl">🍱</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black">{selectedFoodForModal.name}</h3>
                                    <p className="font-bold text-[10px] mt-1 italic uppercase opacity-60 bg-black/10 px-2 inline-block">{selectedFoodForModal.category}</p>
                                </div>
                            </div>
                            {/* 僅限自定義食材顯示刪除按鈕 */}
                            {selectedFoodForModal.id.toString().startsWith('custom_') && (
                                <button onClick={() => handleDeleteCustomFood(selectedFoodForModal.id)} className="bg-red-500 text-white p-2 border-4 border-slate-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 active:translate-y-1 active:shadow-none">
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-2 border-4 border-slate-100 p-2 bg-slate-50">
                            {/* 防禦性處理：若無紀錄則顯示提示而不報錯 */}
                            {(!selectedFoodForModal.logs || selectedFoodForModal.logs.length === 0) ? (
                                <p className="text-center py-10 font-black text-slate-300 italic">尚無歷史數據</p>
                            ) : (
                                [...selectedFoodForModal.logs].reverse().map((log, i) => {
                                    // 計算反轉後的原始索引以正確刪除
                                    const originalIndex = selectedFoodForModal.logs.length - 1 - i;
                                    return (
                                        <div key={i} className={`flex justify-between items-center bg-white p-3 border-2 border-slate-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${log.reaction ? 'border-red-500 bg-red-50' : ''}`}>
                                            <span className="font-black text-sm flex items-center gap-1">
                                                <Clock size={12} />{log.date} — {log.ml}ml
                                                {log.reaction && <span className="text-red-500 font-black ml-1">⚠️ 過敏</span>}
                                            </span>
                                            <button onClick={() => handleDeleteLog(selectedFoodForModal.id, originalIndex)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}