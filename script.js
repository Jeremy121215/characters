// 最小化测试版本
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 已加载');
    
    // 简单测试数据
    const testSymbols = [
        {symbol: "+", name: "加号", category: "数学"},
        {symbol: "-", name: "减号", category: "数学"},
        {symbol: "😀", name: "笑脸", category: "emoji"}
    ];
    
    // 渲染到页面
    const container = document.getElementById('symbolsContainer');
    if (container) {
        container.innerHTML = testSymbols.map(symbol => `
            <div class="symbol-card">
                <div class="symbol-char">${symbol.symbol}</div>
                <div class="symbol-name">${symbol.name}</div>
                <button class="copy-btn">复制</button>
            </div>
        `).join('');
        
        console.log('已渲染', testSymbols.length, '个字符');
    } else {
        console.error('找不到 symbolsContainer 元素');
    }
});
