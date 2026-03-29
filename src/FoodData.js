// src/FoodData.js 完整修正版本

import imgStap from './assets/stap_rice.png';
import imgMeat from './assets/meat_pork.png';
import imgVeg from './assets/veg_cabbage.png';
import imgEgg from './assets/egg_egg.png';
import imgSeafood from './assets/seafood_fish.png';
import imgfruit from './assets/fruit_banana.png';
import imgDrink from './assets/drink_milk.png';
import imgNut from './assets/nut_peanut.png';

export const INITIAL_FOODS = [
    // 主食 (st01 - st06)
    { "id": "st01", "name": "白米", "category": "主食", "status": "candidate", "logs": [], "image": imgStap },
    { "id": "st02", "name": "蕎麥", "category": "主食", "status": "candidate", "logs": [], "image": imgStap },
    { "id": "st03", "name": "糙米", "category": "主食", "status": "candidate", "logs": [], "image": imgStap },
    { "id": "st04", "name": "小米", "category": "主食", "status": "candidate", "logs": [], "image": imgStap },
    { "id": "st05", "name": "燕麥", "category": "主食", "status": "candidate", "logs": [], "image": imgStap },
    // 修正：新增白麵
    { "id": "st06", "name": "白麵", "category": "主食", "status": "candidate", "logs": [], "image": imgStap },

    // 肉類 (m01 - m10)
    { "id": "m01", "name": "豬肉", "category": "肉類", "status": "candidate", "logs": [], "image": imgMeat },
    { "id": "m02", "name": "雞肉", "category": "肉類", "status": "candidate", "logs": [], "image": imgMeat },
    { "id": "m03", "name": "牛肉", "category": "肉類", "status": "candidate", "logs": [], "image": imgMeat },
    { "id": "m04", "name": "羊肉", "category": "肉類", "status": "candidate", "logs": [], "image": imgMeat },
    { "id": "m05", "name": "鴨肉", "category": "肉類", "status": "candidate", "logs": [], "image": imgMeat },
    { "id": "m06", "name": "雞肝", "category": "肉類", "status": "candidate", "logs": [], "image": imgMeat },
    { "id": "m07", "name": "豬肝", "category": "肉類", "status": "candidate", "logs": [], "image": imgMeat },
    { "id": "m08", "name": "火雞肉", "category": "肉類", "status": "candidate", "logs": [], "image": imgMeat },
    { "id": "m09", "name": "鵝肉", "category": "肉類", "status": "candidate", "logs": [], "image": imgMeat },
    { "id": "m10", "name": "鴕鳥肉", "category": "肉類", "status": "candidate", "logs": [], "image": imgMeat },

    // 蔬菜 (v01 - v45)
    { "id": "v01", "name": "高麗菜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v02", "name": "青江菜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v03", "name": "空心菜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v04", "name": "花椰菜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v05", "name": "菠菜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v06", "name": "地瓜葉", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v07", "name": "小松菜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v08", "name": "莧菜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v09", "name": "小白菜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v10", "name": "紅蘿蔔", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v11", "name": "白蘿蔔", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v12", "name": "南瓜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v13", "name": "地瓜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v14", "name": "馬鈴薯", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v15", "name": "山藥", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v16", "name": "玉米", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v17", "name": "玉米筍", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v18", "name": "絲瓜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v19", "name": "冬瓜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v20", "name": "大黃瓜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v21", "name": "小黃瓜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v22", "name": "苦瓜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v23", "name": "茄子", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v24", "name": "番茄", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v25", "name": "洋蔥", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v26", "name": "青椒", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v27", "name": "甜椒", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v28", "name": "秋葵", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v29", "name": "蘆筍", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v30", "name": "香菇", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v31", "name": "金針菇", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v32", "name": "杏鮑菇", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v33", "name": "黑木耳", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v34", "name": "白木耳", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v35", "name": "蓮藕", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v36", "name": "豌豆", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v37", "name": "四季豆", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v38", "name": "大蒜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v39", "name": "蔥", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v40", "name": "薑", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v41", "name": "韭菜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v42", "name": "龍鬚菜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v43", "name": "水蓮", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v44", "name": "油菜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },
    { "id": "v45", "name": "娃娃菜", "category": "蔬菜", "status": "candidate", "logs": [], "image": imgVeg },

    // 水果 (f01 - f25)
    { "id": "f01", "name": "香蕉", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f02", "name": "蘋果", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f03", "name": "梨子", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f04", "name": "木瓜", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f05", "name": "酪梨", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f06", "name": "葡萄", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f07", "name": "西瓜", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f08", "name": "哈密瓜", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f09", "name": "蓮霧", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f10", "name": "芭樂", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f11", "name": "奇異果", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f12", "name": "草莓", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f13", "name": "藍莓", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f14", "name": "櫻桃", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f15", "name": "鳳梨", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f16", "name": "芒果", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f17", "name": "火龍果", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f18", "name": "柳丁", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f19", "name": "橘子", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f20", "name": "柚子", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f21", "name": "水蜜桃", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f22", "name": "荔枝", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f23", "name": "枇杷", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f24", "name": "柿子", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },
    { "id": "f25", "name": "李子", "category": "水果", "status": "candidate", "logs": [], "image": imgfruit },

    // 海鮮 (s01 - s10)
    { "id": "s01", "name": "鮭魚", "category": "海鮮", "status": "candidate", "logs": [], "image": imgSeafood },
    { "id": "s02", "name": "鱈魚", "category": "海鮮", "status": "candidate", "logs": [], "image": imgSeafood },
    { "id": "s03", "name": "鯛魚", "category": "海鮮", "status": "candidate", "logs": [], "image": imgSeafood },
    { "id": "s04", "name": "鱸魚", "category": "海鮮", "status": "candidate", "logs": [], "image": imgSeafood },
    { "id": "s05", "name": "吻仔魚", "category": "海鮮", "status": "candidate", "logs": [], "image": imgSeafood },
    { "id": "s06", "name": "鯖魚", "category": "海鮮", "status": "candidate", "logs": [], "image": imgSeafood },
    { "id": "s07", "name": "蝦子", "category": "海鮮", "status": "candidate", "logs": [], "image": imgSeafood },
    { "id": "s08", "name": "蛤蜊", "category": "海鮮", "status": "candidate", "logs": [], "image": imgSeafood },
    { "id": "s09", "name": "干貝", "category": "海鮮", "status": "candidate", "logs": [], "image": imgSeafood },
    { "id": "s10", "name": "吻仔魚", "category": "海鮮", "status": "candidate", "logs": [], "image": imgSeafood },

    // 飲品與乳製品 (d03 - d05)
    // 修正：已移除母乳與配方奶
    { "id": "d03", "name": "全脂鮮乳", "category": "飲品", "status": "candidate", "logs": [], "image": imgDrink },
    { "id": "d04", "name": "無糖豆漿", "category": "飲品", "status": "candidate", "logs": [], "image": imgDrink },
    { "id": "d05", "name": "燕麥奶", "category": "飲品", "status": "candidate", "logs": [], "image": imgDrink },

    // 雞蛋 (e01 - e02)
    { "id": "e01", "name": "雞蛋黃", "category": "雞蛋", "status": "candidate", "logs": [], "image": imgEgg },
    { "id": "e02", "name": "雞蛋白", "category": "雞蛋", "status": "candidate", "logs": [], "image": imgEgg },

    // 堅果 (n01 - n03)
    { "id": "n01", "name": "花生", "category": "堅果", "status": "candidate", "logs": [], "image": imgNut },
    { "id": "n02", "name": "核桃", "category": "堅果", "status": "candidate", "logs": [], "image": imgNut },
    { "id": "n03", "name": "芝麻", "category": "堅果", "status": "candidate", "logs": [], "image": imgNut }
];

export const CATEGORY_COLORS = {
    '主食': 'bg-[#F0E39B]',
    '肉類': 'bg-[#FFB6C1]',
    '蔬菜': 'bg-[#98FB98]',
    '水果': 'bg-[#FFFFE0]',
    '海鮮': 'bg-[#76B6EF]',
    '飲品': 'bg-[#C5DFEF]',
    '雞蛋': 'bg-[#FFFFFF]',
    '堅果': 'bg-[#D2B48C]',
};