// 特殊字符网站主脚本

// 全局状态
const state = {
    symbols: [],
    categories: ['all'],
    currentCategory: 'all',
    searchMode: 'all',
    searchQuery: '',
    isLoading: true
};

// DOM 元素缓存
const dom = {
    symbolsContainer: null,
    categoryList: null,
    searchInput: null,
    clearSearchBtn: null,
    currentCategoryElement: null,
    categoryCountElement: null,
    symbolCountElement: null,
    noResultsElement: null,
    notification: null,
    aboutModal: null
};

// 默认数据（确保页面总有内容显示）
const defaultSymbols = [
    {"symbol": "+", "name": "加号", "category": "数学", "keywords": ["加", "加法", "正号", "plus"]},
    {"symbol": "-", "name": "减号", "category": "数学", "keywords": ["减", "减法", "负号", "minus"]},
    {"symbol": "×", "name": "乘号", "category": "数学", "keywords": ["乘", "乘法", "times"]},
    {"symbol": "÷", "name": "除号", "category": "数学", "keywords": ["除", "除法", "divide"]},
    {"symbol": "=", "name": "等号", "category": "数学", "keywords": ["等于", "equal"]},
    {"symbol": "≠", "name": "不等号", "category": "数学", "keywords": ["不等于", "not equal"]},
    {"symbol": "α", "name": "Alpha", "category": "希腊字母", "keywords": ["阿尔法", "alpha"]},
    {"symbol": "β", "name": "Beta", "category": "希腊字母", "keywords": ["贝塔", "beta"]},
    {"symbol": "π", "name": "圆周率", "category": "数学", "keywords": ["圆周率", "pi"]},
    {"symbol": "∞", "name": "无穷大", "category": "数学", "keywords": ["无穷大", "infinity"]},
    {"symbol": "∑", "name": "求和符号", "category": "数学", "keywords": ["求和", "summation"]},
    {"symbol": "√", "name": "平方根", "category": "数学", "keywords": ["平方根", "square root"]},
    {"symbol": "∫", "name": "积分符号", "category": "数学", "keywords": ["积分", "integral"]},
    {"symbol": "∈", "name": "属于", "category": "数学", "keywords": ["属于", "element of"]},
    {"symbol": "∀", "name": "任意", "category": "数学", "keywords": ["任意", "for all"]},
    {"symbol": "∃", "name": "存在", "category": "数学", "keywords": ["存在", "there exists"]},
    {"symbol": "←", "name": "左箭头", "category": "箭头", "keywords": ["箭头", "左", "left"]},
    {"symbol": "→", "name": "右箭头", "category": "箭头", "keywords": ["箭头", "右", "right"]},
    {"symbol": "↑", "name": "上箭头", "category": "箭头", "keywords": ["箭头", "上", "up"]},
    {"symbol": "↓", "name": "下箭头", "category": "箭头", "keywords": ["箭头", "下", "down"]},
    {"symbol": "😀", "name": "笑脸", "category": "emoji", "keywords": ["笑脸", "smile"]},
    {"symbol": "😂", "name": "笑哭", "category": "emoji", "keywords": ["笑哭", "tears of joy"]},
    {"symbol": "😊", "name": "微笑", "category": "emoji", "keywords": ["微笑", "blush"]},
    {"symbol": "❤️", "name": "红心", "category": "emoji", "keywords": ["红心", "heart"]},
    {"symbol": "🔥", "name": "火焰", "category": "emoji", "keywords": ["火焰", "fire"]},
    {"symbol": "⭐", "name": "星星", "category": "emoji", "keywords": ["星星", "star"]},
    {"symbol": "✅", "name": "对勾", "category": "emoji", "keywords": ["对勾", "check mark"]},
    {"symbol": "❌", "name": "叉号", "category": "emoji", "keywords": ["叉号", "cross mark"]},
    {"symbol": "$", "name": "美元", "category": "货币", "keywords": ["货币", "美元", "dollar"]},
    {"symbol": "€", "name": "欧元", "category": "货币", "keywords": ["货币", "欧元", "euro"]},
    {"symbol": "¥", "name": "人民币", "category": "货币", "keywords": ["货币", "人民币", "yen"]},
    {"symbol": "£", "name": "英镑", "category": "货币", "keywords": ["货币", "英镑", "pound"]},
    {"symbol": "©", "name": "版权符号", "category": "特殊", "keywords": ["版权", "copyright"]},
    {"symbol": "®", "name": "注册商标", "category": "特殊", "keywords": ["商标", "registered"]},
    {"symbol": "™", "name": "商标符号", "category": "特殊", "keywords": ["商标", "trademark"]},
    {"symbol": "°", "name": "度", "category": "数学", "keywords": ["度", "degree"]},
    {"symbol": "μ", "name": "微", "category": "数学", "keywords": ["微", "micro"]},
    {"symbol": "θ", "name": "Theta", "category": "希腊字母", "keywords": ["西塔", "theta"]},
    {"symbol": "λ", "name": "Lambda", "category": "希腊字母", "keywords": ["兰姆达", "lambda"]},
    {"symbol": "σ", "name": "Sigma", "category": "希腊字母", "keywords": ["西格玛", "sigma"]},
    {"symbol": "ω", "name": "Omega", "category": "希腊字母", "keywords": ["欧米伽", "omega"]},
    {"symbol": "★", "name": "实心星星", "category": "几何", "keywords": ["星星", "star"]},
    {"symbol": "☆", "name": "空心星星", "category": "几何", "keywords": ["星星", "star"]},
    {"symbol": "■", "name": "实心方形", "category": "几何", "keywords": ["方形", "square"]},
    {"symbol": "●", "name": "实心圆形", "category": "几何", "keywords": ["圆形", "circle"]},
    {"symbol": "▲", "name": "实心三角形", "category": "几何", "keywords": ["三角形", "triangle"]}
];

// 初始化函数
function init() {
    console.log('开始初始化特殊字符网站...');
    
    // 缓存 DOM 元素
    cacheDOMElements();
    
    // 设置初始数据
    setupInitialData();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 渲染初始界面
    renderCategories();
    renderSymbols();
    updateCounts();
    
    // 尝试加载外部数据
    loadExternalData();
    
    console.log('网站初始化完成');
}

// 缓存 DOM 元素
function cacheDOMElements() {
    dom.symbolsContainer = document.getElementById('symbolsContainer');
    dom.categoryList = document.getElementById('categoryList');
    dom.searchInput = document.getElementById('searchInput');
    dom.clearSearchBtn = document.getElementById('clearSearch');
    dom.currentCategoryElement = document.getElementById('currentCategory');
    dom.categoryCountElement = document.getElementById('categoryCount');
    dom.symbolCountElement = document.getElementById('symbolCount');
    dom.noResultsElement = document.getElementById('noResults');
    dom.notification = document.getElementById('notification');
    dom.aboutModal = document.getElementById('aboutModal');
    
    console.log('DOM 元素缓存完成');
}

// 设置初始数据
function setupInitialData() {
    state.symbols = [...defaultSymbols];
    updateCategories();
    state.isLoading = false;
    
    console.log('使用默认数据，字符数量:', state.symbols.length);
}

// 更新分类列表
function updateCategories() {
    const uniqueCategories = new Set(state.symbols.map(symbol => symbol.category));
    state.categories = ['all', ...Array.from(uniqueCategories).sort()];
}

// 加载外部数据
async function loadExternalData() {
    console.log('尝试加载外部字符数据...');
    
    try {
        // 显示加载状态
        showLoadingState();
        
        const response = await fetch('chars.json');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
            console.log('成功加载外部数据，字符数量:', data.length);
            
            // 合并数据（外部数据优先）
            const externalSymbols = data.filter(item => 
                item && item.symbol && item.name && item.category
            );
            
            if (externalSymbols.length > 0) {
                // 创建映射以确保唯一性（按 symbol + name）
                const symbolMap = new Map();
                
                // 先添加外部数据
                externalSymbols.forEach(symbol => {
                    const key = `${symbol.symbol}|${symbol.name}`;
                    symbolMap.set(key, symbol);
                });
                
                // 再添加默认数据（不覆盖外部数据）
                state.symbols.forEach(symbol => {
                    const key = `${symbol.symbol}|${symbol.name}`;
                    if (!symbolMap.has(key)) {
                        symbolMap.set(key, symbol);
                    }
                });
                
                state.symbols = Array.from(symbolMap.values());
                updateCategories();
                
                // 重新渲染
                renderCategories();
                renderSymbols();
                updateCounts();
                
                showNotification(`已加载 ${state.symbols.length} 个字符`);
            }
        } else {
            console.warn('外部数据格式不正确或为空');
        }
    } catch (error) {
        console.warn('加载外部数据失败，使用默认数据:', error.message);
    } finally {
        hideLoadingState();
    }
}

// 显示加载状态
function showLoadingState() {
    if (dom.symbolsContainer) {
        dom.symbolsContainer.innerHTML = `
            <div class="loading" style="grid-column: 1 / -1;">
                <div class="spinner"></div>
                <p style="margin-left: 1rem;">正在加载字符数据...</p>
            </div>
        `;
    }
}

// 隐藏加载状态
function hideLoadingState() {
    // 加载状态会在 renderSymbols() 中被清除
}

// 设置事件监听器
function setupEventListeners() {
    console.log('设置事件监听器...');
    
    // 搜索输入事件
    if (dom.searchInput) {
        dom.searchInput.addEventListener('input', debounce(handleSearchInput, 300));
    }
    
    // 清除搜索按钮
    if (dom.clearSearchBtn) {
        dom.clearSearchBtn.addEventListener('click', handleClearSearch);
    }
    
    // 搜索模式切换
    document.querySelectorAll('input[name="searchMode"]').forEach(radio => {
        radio.addEventListener('change', handleSearchModeChange);
    });
    
    // 分类列表事件委托
    if (dom.categoryList) {
        dom.categoryList.addEventListener('click', handleCategoryClick);
    }
    
    // 快速链接按钮
    document.querySelectorAll('.quick-btn').forEach(button => {
        button.addEventListener('click', handleQuickLinkClick);
    });
    
    // 字符容器事件委托
    if (dom.symbolsContainer) {
        dom.symbolsContainer.addEventListener('click', handleSymbolClick);
        dom.symbolsContainer.addEventListener('dblclick', handleSymbolDoubleClick);
    }
    
    // 页脚链接
    document.getElementById('showAbout')?.addEventListener('click', showAboutModal);
    document.getElementById('showFeedback')?.addEventListener('click', showFeedback);
    document.getElementById('toggleDarkMode')?.addEventListener('click', toggleDarkMode);
    
    // 模态框关闭
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', closeModal);
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === dom.aboutModal) {
            closeModal();
        }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    console.log('事件监听器设置完成');
}

// 事件处理函数
function handleSearchInput(e) {
    state.searchQuery = e.target.value.toLowerCase().trim();
    
    if (dom.clearSearchBtn) {
        dom.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
    }
    
    renderSymbols();
    updateCounts();
}

function handleClearSearch() {
    if (dom.searchInput) {
        dom.searchInput.value = '';
        state.searchQuery = '';
        dom.clearSearchBtn.style.display = 'none';
        renderSymbols();
        updateCounts();
    }
}

function handleSearchModeChange(e) {
    state.searchMode = e.target.value;
    renderSymbols();
    updateCounts();
}

function handleCategoryClick(e) {
    const button = e.target.closest('.category-btn');
    if (button && button.dataset.category) {
        setActiveCategory(button.dataset.category);
    }
}

function handleQuickLinkClick(e) {
    const category = e.target.closest('.quick-btn').dataset.category;
    if (category) {
        setActiveCategory(category);
    }
}

function handleSymbolClick(e) {
    const copyBtn = e.target.closest('.copy-btn');
    if (copyBtn && copyBtn.dataset.symbol) {
        copySymbol(copyBtn.dataset.symbol, copyBtn);
    }
}

function handleSymbolDoubleClick(e) {
    const card = e.target.closest('.symbol-card');
    if (card) {
        const symbolChar = card.querySelector('.symbol-char')?.textContent;
        const copyBtn = card.querySelector('.copy-btn');
        if (symbolChar) {
            copySymbol(symbolChar, copyBtn);
        }
    }
}

function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + F 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        if (dom.searchInput) {
            dom.searchInput.focus();
            dom.searchInput.select();
        }
    }
    
    // Esc 清除搜索
    if (e.key === 'Escape' && dom.searchInput && document.activeElement === dom.searchInput) {
        handleClearSearch();
        dom.searchInput.blur();
    }
}

// 设置活动分类
function setActiveCategory(category) {
    state.currentCategory = category;
    
    // 更新UI中的活动分类按钮
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    // 更新当前分类标题
    if (dom.currentCategoryElement) {
        dom.currentCategoryElement.textContent = category === 'all' ? '所有字符' : category;
    }
    
    renderSymbols();
    updateCounts();
}

// 过滤符号
function filterSymbols() {
    let filteredSymbols = state.symbols;
    
    // 按分类过滤
    if (state.currentCategory !== 'all') {
        filteredSymbols = filteredSymbols.filter(symbol => symbol.category === state.currentCategory);
    }
    
    // 按搜索词过滤
    if (state.searchQuery) {
        const searchIn = state.searchMode === 'all' ? state.symbols : filteredSymbols;
        filteredSymbols = searchIn.filter(symbol => {
            // 检查名称
            if (symbol.name && symbol.name.toLowerCase().includes(state.searchQuery)) {
                return true;
            }
            
            // 检查符号
            if (symbol.symbol && symbol.symbol.toLowerCase().includes(state.searchQuery)) {
                return true;
            }
            
            // 检查关键词
            if (symbol.keywords && Array.isArray(symbol.keywords)) {
                return symbol.keywords.some(keyword => 
                    keyword && keyword.toLowerCase().includes(state.searchQuery)
                );
            }
            
            return false;
        });
    }
    
    return filteredSymbols;
}

// 渲染分类列表
function renderCategories() {
    if (!dom.categoryList) return;
    
    // 计算每个分类的数量
    const categoryCounts = {};
    state.symbols.forEach(symbol => {
        const cat = symbol.category;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    // 渲染分类列表
    dom.categoryList.innerHTML = '';
    
    state.categories.forEach(category => {
        const li = document.createElement('li');
        const count = category === 'all' ? state.symbols.length : categoryCounts[category] || 0;
        const displayName = category === 'all' ? '所有字符' : category;
        
        li.innerHTML = `
            <button class="category-btn ${category === 'all' ? 'active' : ''}" 
                    data-category="${category}">
                ${escapeHtml(displayName)}
                <span class="category-count">${count}</span>
            </button>
        `;
        
        dom.categoryList.appendChild(li);
    });
}

// 渲染字符卡片
function renderSymbols() {
    if (!dom.symbolsContainer) return;
    
    const filteredSymbols = filterSymbols();
    
    // 更新无结果消息
    if (dom.noResultsElement) {
        if (filteredSymbols.length === 0) {
            dom.noResultsElement.style.display = 'block';
            dom.symbolsContainer.style.display = 'none';
            return;
        } else {
            dom.noResultsElement.style.display = 'none';
            dom.symbolsContainer.style.display = 'grid';
        }
    }
    
    // 渲染字符卡片
    dom.symbolsContainer.innerHTML = '';
    
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
        
        dom.symbolsContainer.appendChild(card);
    });
}

// 更新计数显示
function updateCounts() {
    const filteredSymbols = filterSymbols();
    
    if (dom.symbolCountElement) {
        dom.symbolCountElement.textContent = filteredSymbols.length;
    }
    
    if (dom.categoryCountElement) {
        dom.categoryCountElement.textContent = filteredSymbols.length;
    }
}

// 复制字符到剪贴板
async function copySymbol(symbol, button) {
    if (!symbol) return;
    
    try {
        // 使用现代 Clipboard API
        await navigator.clipboard.writeText(symbol);
        
        showNotification(`已复制: ${symbol}`);
        
        // 按钮反馈效果
        if (button) {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> 已复制';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('copied');
            }, 1500);
        }
    } catch (err) {
        console.error('复制失败，使用降级方案:', err);
        
        // 降级方案：使用 textarea
        const textArea = document.createElement('textarea');
        textArea.value = symbol;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification(`已复制: ${symbol}`);
        } catch (execErr) {
            console.error('降级方案也失败了:', execErr);
            showNotification('复制失败，请手动复制');
        } finally {
            document.body.removeChild(textArea);
        }
    }
}

// 显示通知
function showNotification(message) {
    if (!dom.notification) return;
    
    const notificationText = dom.notification.querySelector('span');
    if (notificationText) {
        notificationText.textContent = message || '字符已复制到剪贴板！';
    }
    
    dom.notification.classList.add('show');
    
    setTimeout(() => {
        dom.notification.classList.remove('show');
    }, 2000);
}

// 显示关于模态框
function showAboutModal() {
    if (dom.aboutModal) {
        dom.aboutModal.style.display = 'flex';
    }
}

// 显示反馈
function showFeedback() {
    alert('感谢您的反馈！\n\n如有任何建议或发现问题，请通过以下方式联系我们：\n• 字符错误或缺失\n• 功能改进建议\n• 界面优化意见\n\n您可以将反馈发送至：feedback@example.com');
}

// 关闭模态框
function closeModal() {
    if (dom.aboutModal) {
        dom.aboutModal.style.display = 'none';
    }
}

// 切换深色模式
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // 更新按钮文本
    const button = document.getElementById('toggleDarkMode');
    if (button) {
        button.textContent = newTheme === 'dark' ? '切换浅色模式' : '切换深色模式';
    }
}

// 应用保存的主题
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // 更新按钮文本
    const button = document.getElementById('toggleDarkMode');
    if (button) {
        button.textContent = savedTheme === 'dark' ? '切换浅色模式' : '切换深色模式';
    }
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：HTML 转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 调试工具
window.debugApp = {
    getSymbolCount: () => state.symbols.length,
    getCategories: () => [...state.categories],
    getCurrentCategory: () => state.currentCategory,
    reloadData: () => {
        loadExternalData();
        return state.symbols.length;
    },
    showAllData: () => {
        console.log('所有字符数据:', state.symbols);
        return state.symbols;
    },
    clearSearch: () => {
        handleClearSearch();
    }
};

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        applySavedTheme();
        init();
    });
} else {
    applySavedTheme();
    init();
}
