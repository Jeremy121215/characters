// 特殊字符网站主脚本 - 修复版
// 数据源：chars.json

// 全局变量
let allSymbols = [];
let currentCategory = 'all';
let searchMode = 'all';
let searchQuery = '';
let categories = [];

// DOM 元素变量
let symbolsContainer, categoryList, searchInput, clearSearchBtn;
let currentCategoryElement, categoryCountElement, symbolCountElement;
let noResultsElement, notification;

// 初始化函数 - 修改为立即执行
(function init() {
    console.log('网站开始初始化...');
    
    // 获取 DOM 元素
    symbolsContainer = document.getElementById('symbolsContainer');
    categoryList = document.getElementById('categoryList');
    searchInput = document.getElementById('searchInput');
    clearSearchBtn = document.getElementById('clearSearch');
    currentCategoryElement = document.getElementById('currentCategory');
    categoryCountElement = document.getElementById('categoryCount');
    symbolCountElement = document.getElementById('symbolCount');
    noResultsElement = document.getElementById('noResults');
    notification = document.getElementById('notification');
    
    // 设置初始数据
    setupInitialData();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 渲染初始界面
    renderCategories();
    renderSymbols();
    updateCounts();
    
    console.log('网站初始化完成');
})();

// 设置初始数据
function setupInitialData() {
    // 首先使用默认数据
    allSymbols = getDefaultSymbols();
    
    // 提取分类
    const uniqueCategories = new Set(allSymbols.map(symbol => symbol.category));
    categories = ['all', ...Array.from(uniqueCategories).sort()];
    
    console.log('使用默认数据，字符数量:', allSymbols.length);
    
    // 异步加载 chars.json
    loadCharsJSON();
}

// 加载 chars.json 文件
async function loadCharsJSON() {
    try {
        const response = await fetch('chars.json');
        
        if (!response.ok) {
            console.warn('无法加载 chars.json，使用默认数据');
            return;
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
            allSymbols = data;
            
            // 提取分类
            const uniqueCategories = new Set(allSymbols.map(symbol => symbol.category));
            categories = ['all', ...Array.from(uniqueCategories).sort()];
            
            console.log('从 chars.json 加载了', allSymbols.length, '个字符');
            
            // 重新渲染
            renderCategories();
            renderSymbols();
            updateCounts();
        }
    } catch (error) {
        console.warn('加载 chars.json 失败:', error.message, '，继续使用默认数据');
    }
}

// 默认字符数据（确保一定有数据）
function getDefaultSymbols() {
    return [
        {"symbol": "+", "name": "加号", "category": "数学", "keywords": ["加", "加法"]},
        {"symbol": "-", "name": "减号", "category": "数学", "keywords": ["减", "减法"]},
        {"symbol": "×", "name": "乘号", "category": "数学", "keywords": ["乘", "乘法"]},
        {"symbol": "÷", "name": "除号", "category": "数学", "keywords": ["除", "除法"]},
        {"symbol": "=", "name": "等号", "category": "数学", "keywords": ["等于", "等号"]},
        {"symbol": "≠", "name": "不等号", "category": "数学", "keywords": ["不等于"]},
        {"symbol": "≈", "name": "约等号", "category": "数学", "keywords": ["约等于"]},
        {"symbol": "α", "name": "Alpha", "category": "希腊字母", "keywords": ["阿尔法"]},
        {"symbol": "β", "name": "Beta", "category": "希腊字母", "keywords": ["贝塔"]},
        {"symbol": "γ", "name": "Gamma", "category": "希腊字母", "keywords": ["伽马"]},
        {"symbol": "π", "name": "Pi", "category": "数学", "keywords": ["圆周率"]},
        {"symbol": "∑", "name": "求和符号", "category": "数学", "keywords": ["求和"]},
        {"symbol": "∞", "name": "无穷大", "category": "数学", "keywords": ["无穷"]},
        {"symbol": "😀", "name": "笑脸", "category": "emoji", "keywords": ["表情"]},
        {"symbol": "😊", "name": "微笑", "category": "emoji", "keywords": ["表情"]},
        {"symbol": "❤️", "name": "红心", "category": "emoji", "keywords": ["爱心"]},
        {"symbol": "←", "name": "左箭头", "category": "箭头", "keywords": ["箭头"]},
        {"symbol": "→", "name": "右箭头", "category": "箭头", "keywords": ["箭头"]},
        {"symbol": "↑", "name": "上箭头", "category": "箭头", "keywords": ["箭头"]},
        {"symbol": "↓", "name": "下箭头", "category": "箭头", "keywords": ["箭头"]},
        {"symbol": "$", "name": "美元", "category": "货币", "keywords": ["货币"]},
        {"symbol": "€", "name": "欧元", "category": "货币", "keywords": ["货币"]},
        {"symbol": "¥", "name": "人民币", "category": "货币", "keywords": ["货币"]},
        {"symbol": "©", "name": "版权", "category": "特殊", "keywords": ["版权"]},
        {"symbol": "®", "name": "注册商标", "category": "特殊", "keywords": ["商标"]},
        {"symbol": "★", "name": "实心星星", "category": "几何", "keywords": ["星星"]},
        {"symbol": "☆", "name": "空心星星", "category": "几何", "keywords": ["星星"]}
    ];
}

// 设置事件监听器
function setupEventListeners() {
    console.log('设置事件监听器...');
    
    // 搜索输入
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchQuery = e.target.value.toLowerCase().trim();
            
            if (clearSearchBtn) {
                clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
            }
            
            // 防抖处理
            clearTimeout(window.searchTimeout);
            window.searchTimeout = setTimeout(() => {
                renderSymbols();
                updateCounts();
            }, 300);
        });
    }
    
    // 清除搜索按钮
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                searchQuery = '';
                clearSearchBtn.style.display = 'none';
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
    
    // 关于按钮
    const showAboutBtn = document.getElementById('showAbout');
    if (showAboutBtn) {
        showAboutBtn.addEventListener('click', function() {
            const aboutModal = document.getElementById('aboutModal');
            if (aboutModal) {
                aboutModal.style.display = 'flex';
            }
        });
    }
    
    // 模态框关闭按钮
    const closeModalButtons = document.querySelectorAll('.close-modal');
    if (closeModalButtons.length > 0) {
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                const aboutModal = document.getElementById('aboutModal');
                if (aboutModal) {
                    aboutModal.style.display = 'none';
                }
            });
        });
    }
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        const aboutModal = document.getElementById('aboutModal');
        if (aboutModal && e.target === aboutModal) {
            aboutModal.style.display = 'none';
        }
    });
    
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
    if (currentCategoryElement) {
        currentCategoryElement.textContent = category === 'all' ? '所有字符' : category;
    }
    
    renderSymbols();
    updateCounts();
}

// 渲染分类列表
function renderCategories() {
    if (!categoryList) return;
    
    console.log('渲染分类列表...');
    
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
        
        // 添加点击事件
        li.querySelector('.category-btn').addEventListener('click', function() {
            const category = this.dataset.category;
            if (category) {
                setActiveCategory(category);
            }
        });
    });
    
    console.log('分类列表渲染完成');
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
    if (!symbolsContainer) return;
    
    const filteredSymbols = filterSymbols();
    
    console.log('渲染字符，数量:', filteredSymbols.length);
    
    // 更新无结果消息
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
    
    // 清空容器
    symbolsContainer.innerHTML = '';
    
    // 渲染字符卡片
    filteredSymbols.forEach(symbol => {
        const card = document.createElement('div');
        card.className = 'symbol-card';
        card.title = '双击复制字符';
        
        card.innerHTML = `
            <div class="symbol-char">${symbol.symbol}</div>
            <div class="symbol-name">${symbol.name}</div>
            ${symbol.category !== '其他' ? `<div class="symbol-category">${symbol.category}</div>` : ''}
            <button class="copy-btn" data-symbol="${symbol.symbol}">
                <i class="far fa-copy"></i> 复制
            </button>
        `;
        
        symbolsContainer.appendChild(card);
        
        // 添加复制事件
        const copyBtn = card.querySelector('.copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                const symbolChar = this.dataset.symbol;
                if (symbolChar) {
                    copySymbol(symbolChar, this);
                }
            });
        }
        
        // 双击卡片复制
        card.addEventListener('dblclick', function() {
            const symbolChar = symbol.symbol;
            if (symbolChar) {
                const copyBtn = this.querySelector('.copy-btn');
                copySymbol(symbolChar, copyBtn);
            }
        });
    });
}

// 更新计数显示
function updateCounts() {
    const filteredSymbols = filterSymbols();
    
    if (symbolCountElement) {
        symbolCountElement.textContent = filteredSymbols.length;
    }
    
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
        } else {
            console.error('复制失败');
        }
    } catch (err) {
        console.error('复制失败:', err);
        // 尝试使用现代 API
        if (navigator.clipboard) {
            navigator.clipboard.writeText(symbol).then(() => {
                showNotification(`已复制: ${symbol}`);
            });
        }
    } finally {
        document.body.removeChild(textArea);
    }
}

// 显示通知
function showNotification(message) {
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

// 导出到全局，方便调试
window.app = {
    reloadData: function() {
        loadCharsJSON();
        return allSymbols.length;
    },
    getData: function() {
        return allSymbols;
    },
    getCategories: function() {
        return categories;
    },
    getCurrentCategory: function() {
        return currentCategory;
    }
};
