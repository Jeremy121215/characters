// 特殊字符网站主脚本
// 数据源：chars.json

// 全局变量
let allSymbols = [];
let currentCategory = 'all';
let searchMode = 'all';
let searchQuery = '';
let categories = [];

// DOM 元素
const symbolsContainer = document.getElementById('symbolsContainer');
const categoryList = document.getElementById('categoryList');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const searchModeRadios = document.querySelectorAll('input[name="searchMode"]');
const currentCategoryElement = document.getElementById('currentCategory');
const categoryCountElement = document.getElementById('categoryCount');
const symbolCountElement = document.getElementById('symbolCount');
const noResultsElement = document.getElementById('noResults');
const notification = document.getElementById('notification');
const quickButtons = document.querySelectorAll('.quick-btn');
const showAboutBtn = document.getElementById('showAbout');
const showFeedbackBtn = document.getElementById('showFeedback');
const toggleDarkModeBtn = document.getElementById('toggleDarkMode');
const aboutModal = document.getElementById('aboutModal');
const closeModalButtons = document.querySelectorAll('.close-modal');

// 初始化函数
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// 应用程序初始化
async function initApp() {
    try {
        // 加载字符数据
        await loadSymbols();
        
        // 初始化UI
        renderCategories();
        renderSymbols();
        updateCounts();
        
        // 设置事件监听器
        setupEventListeners();
        
        // 恢复主题设置
        updateTheme();
        
        console.log('网站初始化完成，加载了', allSymbols.length, '个字符');
    } catch (error) {
        console.error('初始化失败:', error);
        showErrorMessage('网站初始化失败，请刷新页面重试。');
    }
}

// 加载字符数据
async function loadSymbols() {
    try {
        const response = await fetch('chars.json');
        
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }
        
        allSymbols = await response.json();
        
        // 数据验证
        if (!Array.isArray(allSymbols)) {
            throw new Error('数据格式错误: 应为数组');
        }
        
        // 确保每个字符都有必要的字段
        allSymbols = allSymbols.map((symbol, index) => {
            return {
                symbol: symbol.symbol || '?',
                name: symbol.name || `字符${index + 1}`,
                category: symbol.category || '其他',
                keywords: symbol.keywords || []
            };
        });
        
        // 提取所有分类
        const uniqueCategories = new Set(allSymbols.map(symbol => symbol.category));
        categories = ['all', ...Array.from(uniqueCategories).sort()];
        
    } catch (error) {
        console.error('加载字符数据失败:', error);
        
        // 使用默认数据
        allSymbols = getDefaultSymbols();
        const uniqueCategories = new Set(allSymbols.map(symbol => symbol.category));
        categories = ['all', ...Array.from(uniqueCategories).sort()];
        
        console.warn('已使用默认数据，请确保chars.json文件存在');
    }
}

// 默认字符数据（备用）
function getDefaultSymbols() {
    return [
        {"symbol": "+", "name": "加号", "category": "数学", "keywords": ["加", "加法", "正号", "plus"]},
        {"symbol": "-", "name": "减号", "category": "数学", "keywords": ["减", "减法", "负号", "minus"]},
        {"symbol": "×", "name": "乘号", "category": "数学", "keywords": ["乘", "乘法", "times"]},
        {"symbol": "÷", "name": "除号", "category": "数学", "keywords": ["除", "除法", "divide"]},
        {"symbol": "=", "name": "等号", "category": "数学", "keywords": ["等于", "等号", "equals"]},
        {"symbol": "α", "name": "Alpha", "category": "希腊字母", "keywords": ["阿尔法", "希腊字母", "alpha"]},
        {"symbol": "β", "name": "Beta", "category": "希腊字母", "keywords": ["贝塔", "希腊字母", "beta"]},
        {"symbol": "😀", "name": "笑脸", "category": "emoji", "keywords": ["表情", "笑脸", "emoji"]},
        {"symbol": "←", "name": "左箭头", "category": "箭头", "keywords": ["箭头", "左", "方向"]},
        {"symbol": "$", "name": "美元", "category": "货币", "keywords": ["货币", "美元", "dollar"]}
    ];
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索输入
    searchInput.addEventListener('input', handleSearch);
    
    // 清除搜索按钮
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        renderSymbols();
        updateCounts();
    });
    
    // 搜索模式切换
    searchModeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            searchMode = e.target.value;
            renderSymbols();
            updateCounts();
        });
    });
    
    // 快速链接按钮
    quickButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            setActiveCategory(category);
        });
    });
    
    // 模态框
    showAboutBtn.addEventListener('click', () => {
        aboutModal.style.display = 'flex';
    });
    
    showFeedbackBtn.addEventListener('click', () => {
        alert('感谢您的反馈！您可以通过GitHub提交问题或建议。');
    });
    
    toggleDarkModeBtn.addEventListener('click', toggleDarkMode);
    
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            aboutModal.style.display = 'none';
        });
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            aboutModal.style.display = 'none';
        }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + F 聚焦搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Esc 清除搜索
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            searchQuery = '';
            renderSymbols();
            updateCounts();
            clearSearchBtn.style.display = 'none';
        }
    });
}

// 处理搜索
function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase().trim();
    clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
    
    // 防抖处理
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
        renderSymbols();
        updateCounts();
    }, 300);
}

// 设置活动分类
function setActiveCategory(category) {
    currentCategory = category;
    
    // 更新分类按钮状态
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    // 更新标题
    currentCategoryElement.textContent = category === 'all' ? '所有字符' : category;
    
    // 渲染字符
    renderSymbols();
    updateCounts();
}

// 渲染分类列表
function renderCategories() {
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
        li.querySelector('.category-btn').addEventListener('click', () => {
            setActiveCategory(category);
        });
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
                    keyword.toLowerCase().includes(searchQuery)
                );
            }
            
            return false;
        });
    }
    
    return filteredSymbols;
}

// 渲染字符卡片
function renderSymbols() {
    const filteredSymbols = filterSymbols();
    
    // 更新无结果消息
    if (filteredSymbols.length === 0) {
        noResultsElement.style.display = 'block';
        symbolsContainer.style.display = 'none';
        return;
    }
    
    noResultsElement.style.display = 'none';
    symbolsContainer.style.display = 'grid';
    
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
        copyBtn.addEventListener('click', () => copySymbol(symbol.symbol, copyBtn));
        
        // 双击卡片复制
        card.addEventListener('dblclick', () => copySymbol(symbol.symbol, copyBtn));
    });
}

// 更新计数显示
function updateCounts() {
    const filteredSymbols = filterSymbols();
    symbolCountElement.textContent = filteredSymbols.length;
    categoryCountElement.textContent = filteredSymbols.length;
}

// 复制字符到剪贴板
function copySymbol(symbol, button) {
    navigator.clipboard.writeText(symbol).then(() => {
        // 显示通知
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
    }).catch(err => {
        console.error('复制失败:', err);
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = symbol;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification(`已复制: ${symbol}`);
    });
}

// 显示通知
function showNotification(message) {
    const notificationText = notification.querySelector('span');
    notificationText.textContent = message || '字符已复制到剪贴板！';
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// 显示错误消息
function showErrorMessage(message) {
    symbolsContainer.innerHTML = `
        <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: #ff6b6b;"></i>
            <h3>加载数据失败</h3>
            <p>${message}</p>
            <button id="retryLoad" class="copy-btn" style="margin-top: 1rem;">
                <i class="fas fa-redo"></i> 重试加载
            </button>
        </div>
    `;
    
    // 添加重试按钮事件
    const retryBtn = document.getElementById('retryLoad');
    if (retryBtn) {
        retryBtn.addEventListener('click', async () => {
            retryBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
            retryBtn.disabled = true;
            
            try {
                await loadSymbols();
                renderCategories();
                renderSymbols();
                updateCounts();
            } catch (error) {
                console.error('重试失败:', error);
            } finally {
                retryBtn.innerHTML = '<i class="fas fa-redo"></i> 重试加载';
                retryBtn.disabled = false;
            }
        });
    }
}

// 切换深色模式
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // 更新按钮文本
    toggleDarkModeBtn.textContent = newTheme === 'dark' ? '切换浅色模式' : '切换深色模式';
}

// 更新主题
function updateTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // 更新按钮文本
    toggleDarkModeBtn.textContent = savedTheme === 'dark' ? '切换浅色模式' : '切换深色模式';
}

// 导出一些实用函数供调试使用
if (typeof window !== 'undefined') {
    window.appUtils = {
        getSymbolCount: () => allSymbols.length,
        getCategories: () => [...categories],
        getCurrentCategory: () => currentCategory,
        reloadData: async () => {
            await loadSymbols();
            renderCategories();
            renderSymbols();
            updateCounts();
            return allSymbols.length;
        }
    };
}
