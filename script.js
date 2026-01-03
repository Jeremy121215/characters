// 特殊字符网站主脚本 - 修复版

// 全局变量
let allSymbols = [];
let currentCategory = 'all';
let searchMode = 'all';
let searchQuery = '';
let categories = [];

// 等待 DOM 完全加载
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 已加载，开始初始化...');
    initApp();
});

// 应用程序初始化
function initApp() {
    console.log('初始化应用程序...');
    
    // 立即加载默认数据
    loadDefaultData();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 渲染初始界面
    renderCategories();
    renderSymbols();
    updateCounts();
    
    console.log('初始化完成，字符数量:', allSymbols.length);
    
    // 异步尝试加载外部 JSON
    setTimeout(loadExternalData, 100);
}

// 加载默认数据（确保页面有内容）
function loadDefaultData() {
    // 简化的默认数据
    allSymbols = [
        {"symbol": "+", "name": "加号", "category": "数学", "keywords": ["加", "加法"]},
        {"symbol": "-", "name": "减号", "category": "数学", "keywords": ["减", "减法"]},
        {"symbol": "×", "name": "乘号", "category": "数学", "keywords": ["乘", "乘法"]},
        {"symbol": "÷", "name": "除号", "category": "数学", "keywords": ["除", "除法"]},
        {"symbol": "=", "name": "等号", "category": "数学", "keywords": ["等于"]},
        {"symbol": "α", "name": "Alpha", "category": "希腊字母", "keywords": ["阿尔法"]},
        {"symbol": "β", "name": "Beta", "category": "希腊字母", "keywords": ["贝塔"]},
        {"symbol": "😀", "name": "笑脸", "category": "emoji", "keywords": ["笑脸"]},
        {"symbol": "←", "name": "左箭头", "category": "箭头", "keywords": ["箭头"]},
        {"symbol": "$", "name": "美元", "category": "货币", "keywords": ["货币"]}
    ];
    
    // 提取分类
    updateCategories();
}

// 更新分类列表
function updateCategories() {
    const uniqueCategories = new Set(allSymbols.map(symbol => symbol.category));
    categories = ['all', ...Array.from(uniqueCategories).sort()];
}

// 异步加载外部数据
function loadExternalData() {
    console.log('尝试加载外部数据...');
    
    fetch('chars.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('成功加载 chars.json，数据长度:', data.length);
            
            if (Array.isArray(data) && data.length > 0) {
                allSymbols = data;
                updateCategories();
                
                // 重新渲染
                renderCategories();
                renderSymbols();
                updateCounts();
                
                console.log('已更新数据，字符数量:', allSymbols.length);
            }
        })
        .catch(error => {
            console.warn('加载外部数据失败，使用默认数据:', error.message);
            // 保持使用默认数据
        });
}

// 设置事件监听器
function setupEventListeners() {
    console.log('设置事件监听器...');
    
    // 搜索输入
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchQuery = e.target.value.toLowerCase().trim();
            const clearSearchBtn = document.getElementById('clearSearch');
            if (clearSearchBtn) {
                clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
            }
            
            renderSymbols();
            updateCounts();
        });
    }
    
    // 清除搜索按钮
    const clearSearchBtn = document.getElementById('clearSearch');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = '';
                searchQuery = '';
                this.style.display = 'none';
                renderSymbols();
                updateCounts();
            }
        });
    }
    
    // 搜索模式切换
    const searchModeRadios = document.querySelectorAll('input[name="searchMode"]');
    if (searchModeRadios.length > 0) {
        searchModeRadios.forEach(radio => {
            radio.addEventListener('change', function(e) {
                searchMode = e.target.value;
                renderSymbols();
                updateCounts();
            });
        });
    }
    
    // 分类按钮事件（使用事件委托）
    const categoryList = document.getElementById('categoryList');
    if (categoryList) {
        categoryList.addEventListener('click', function(e) {
            const button = e.target.closest('.category-btn');
            if (button && button.dataset.category) {
                setActiveCategory(button.dataset.category);
            }
        });
    }
    
    // 快速链接按钮
    const quickButtons = document.querySelectorAll('.quick-btn');
    if (quickButtons.length > 0) {
        quickButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.dataset.category;
                if (category) {
                    setActiveCategory(category);
                }
            });
        });
    }
    
    // 复制按钮事件（使用事件委托）
    const symbolsContainer = document.getElementById('symbolsContainer');
    if (symbolsContainer) {
        symbolsContainer.addEventListener('click', function(e) {
            const copyBtn = e.target.closest('.copy-btn');
            if (copyBtn && copyBtn.dataset.symbol) {
                copySymbol(copyBtn.dataset.symbol, copyBtn);
            }
        });
        
        // 双击卡片复制
        symbolsContainer.addEventListener('dblclick', function(e) {
            const card = e.target.closest('.symbol-card');
            if (card) {
                const symbolChar = card.querySelector('.symbol-char')?.textContent;
                const copyBtn = card.querySelector('.copy-btn');
                if (symbolChar) {
                    copySymbol(symbolChar, copyBtn);
                }
            }
        });
    }
    
    console.log('事件监听器设置完成');
}

// 设置活动分类
function setActiveCategory(category) {
    currentCategory = category;
    
    // 更新UI中的活动分类按钮
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    // 更新当前分类标题
    const currentCategoryElement = document.getElementById('currentCategory');
    if (currentCategoryElement) {
        currentCategoryElement.textContent = category === 'all' ? '所有字符' : category;
    }
    
    renderSymbols();
    updateCounts();
}

// 渲染分类列表
function renderCategories() {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;
    
    console.log('渲染分类列表，分类数量:', categories.length);
    
    // 计算每个分类的数量
    const categoryCounts = {};
    allSymbols.forEach(symbol => {
        const cat = symbol.category;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    // 渲染分类列表
    categoryList.innerHTML = '';
    
    categories.forEach(category => {
        const li = document.createElement('li');
        const count = category === 'all' ? allSymbols.length : categoryCounts[category] || 0;
        const displayName = category === 'all' ? '所有字符' : category;
        
        li.innerHTML = `
            <button class="category-btn ${category === 'all' ? 'active' : ''}" 
                    data-category="${category}">
                ${displayName}
                <span class="category-count">${count}</span>
            </button>
        `;
        
        categoryList.appendChild(li);
    });
}

// 过滤字符
function filterSymbols() {
    let filteredSymbols = allSymbols;
    
    // 按分类过滤
    if (currentCategory !== 'all') {
        filteredSymbols = filteredSymbols.filter(symbol => symbol.category === currentCategory);
    }
    
    // 按搜索词过滤
    if (searchQuery) {
        const searchIn = searchMode === 'all' ? allSymbols : filteredSymbols;
        filteredSymbols = searchIn.filter(symbol => {
            // 检查名称
            if (symbol.name && symbol.name.toLowerCase().includes(searchQuery)) {
                return true;
            }
            
            // 检查符号
            if (symbol.symbol && symbol.symbol.toLowerCase().includes(searchQuery)) {
                return true;
            }
            
            // 检查关键词
            if (symbol.keywords && Array.isArray(symbol.keywords)) {
                return symbol.keywords.some(keyword => 
                    keyword && keyword.toLowerCase().includes(searchQuery)
                );
            }
            
            return false;
        });
    }
    
    return filteredSymbols;
}

// 渲染字符卡片
function renderSymbols() {
    const symbolsContainer = document.getElementById('symbolsContainer');
    if (!symbolsContainer) {
        console.error('找不到 symbolsContainer 元素');
        return;
    }
    
    const filteredSymbols = filterSymbols();
    console.log('渲染字符，数量:', filteredSymbols.length);
    
    // 更新无结果消息
    const noResultsElement = document.getElementById('noResults');
    if (noResultsElement) {
        if (filteredSymbols.length === 0) {
            noResultsElement.style.display = 'block';
            symbolsContainer.style.display = 'none';
            return;
        } else {
            noResultsElement.style.display = 'none';
            symbolsContainer.style.display = 'grid';
        }
    }
    
    // 渲染字符卡片
    symbolsContainer.innerHTML = '';
    
    filteredSymbols.forEach(symbol => {
        const card = document.createElement('div');
        card.className = 'symbol-card';
        card.title = '双击复制字符';
        
        card.innerHTML = `
            <div class="symbol-char">${escapeHtml(symbol.symbol)}</div>
            <div class="symbol-name">${escapeHtml(symbol.name)}</div>
            <div class="symbol-category">${escapeHtml(symbol.category)}</div>
            <button class="copy-btn" data-symbol="${escapeHtml(symbol.symbol)}">
                <i class="far fa-copy"></i> 复制
            </button>
        `;
        
        symbolsContainer.appendChild(card);
    });
    
    console.log('字符渲染完成');
}

// HTML 转义函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 更新计数显示
function updateCounts() {
    const filteredSymbols = filterSymbols();
    
    const symbolCountElement = document.getElementById('symbolCount');
    if (symbolCountElement) {
        symbolCountElement.textContent = filteredSymbols.length;
    }
    
    const categoryCountElement = document.getElementById('categoryCount');
    if (categoryCountElement) {
        categoryCountElement.textContent = filteredSymbols.length;
    }
}

// 复制字符到剪贴板
function copySymbol(symbol, button) {
    if (!symbol) return;
    
    console.log('复制字符:', symbol);
    
    // 创建临时文本区域
    const textArea = document.createElement('textarea');
    textArea.value = symbol;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification(`已复制: ${symbol}`);
            
            // 按钮反馈效果
            if (button) {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> 已复制';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('copied');
                }, 1500);
            }
        }
    } catch (err) {
        console.error('复制失败:', err);
    } finally {
        document.body.removeChild(textArea);
    }
}

// 显示通知
function showNotification(message) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    const notificationText = notification.querySelector('span');
    if (notificationText) {
        notificationText.textContent = message || '字符已复制到剪贴板！';
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// 调试函数
window.debugApp = {
    getSymbolCount: () => allSymbols.length,
    getCategories: () => [...categories],
    getCurrentCategory: () => currentCategory,
    reloadData: () => {
        loadExternalData();
        return allSymbols.length;
    },
    showAllData: () => {
        console.log('所有字符数据:', allSymbols);
        return allSymbols;
    }
};
