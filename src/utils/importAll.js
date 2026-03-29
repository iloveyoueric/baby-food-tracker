// src/utils/importAll.js
let foodImages = {};

try {
    // 這裡的路徑必須是字串字面量，且結尾不要加斜線
    const context = require.context('../assets/food_imgs', false, /\.(png|jpe?g|svg)$/);

    context.keys().forEach((item) => {
        const key = item.replace('./', '').replace(/\.(png|jpe?g|svg)$/, '');
        foodImages[key] = context(item);
    });
    console.log("成功載入圖片 Key 清單:", Object.keys(foodImages));
} catch (e) {
    console.error("Vite/Webpack 無法解析路徑，請檢查資料夾是否存在:", e);
}

export { foodImages };