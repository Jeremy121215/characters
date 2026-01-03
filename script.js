// 特殊字符网站主脚本
// 从外部 JSON 文件加载数据

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

// 常量定义
const SYMBOLS_JSON_PATH = 'chars.json;
const DEFAULT_CATEGORIES = [
    '数学', '希腊字母', '音标', '拼音', '箭头', 'emoji', 
    '货币', '特殊', '几何', '上下标', '扑克', '国际象棋',
    '生物', '宗教文化', '单位', '其他'
];

// 初始化函数
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// 应用程序初始化
async function initApp() {
    try {
        await loadSymbolsFromJSON();
        updateUI();
        setupEventListeners();
        updateTheme();
    } catch (error) {
        console.error('应用程序初始化失败:', error);
        showErrorMessage('无法加载字符数据。请确保 chars.json 文件存在。');
    }
}

// 从 JSON 文件加载符号数据
async function loadSymbolsFromJSON() {
    try {
        const response = await fetch(SYMBOLS_JSON_PATH);
        
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        
        allSymbols = await response.json();
        
        // 验证数据格式
        if (!Array.isArray(allSymbols)) {
            throw new Error('字符数据格式错误: 应为数组格式');
        }
        
        // 提取所有分类
        categories = [...new Set(allSymbols.map(symbol => symbol.category))];
        
        // 确保 "所有字符" 分类在最前面
        if (!categories.includes('all')) {
            categories.unshift('all');
        }
        
        console.log(`成功加载 ${allSymbols.length} 个字符，共 ${categories.length - 1} 个分类`);
    } catch (error) {
        console.error('加载字符数据失败:', error);
        
        // 如果 JSON 加载失败，使用内置的默认数据
        console.warn('使用默认字符数据');
        allSymbols = getDefaultSymbols();
        categories = ['all', ...DEFAULT_CATEGORIES];
    }
}

// 获取默认符号数据（备用）
function getDefaultSymbols() {
    // 这是一个简化的默认数据集，实际项目中应该从 chars.json 加载完整数据
    return [
        { symbol: "+", name: "加号", category: "数学" },
        { symbol: "-", name: "减号", category: "数学" },
        { symbol: "×", name: "乘号", category: "数学" },
        { symbol: "÷", name: "除号", category: "数学" },
        { symbol: "=", name: "等号", category: "数学" },
        { symbol: "≠", name: "不等号", category: "数学" },
        { symbol: "≈", name: "约等号", category: "数学" },
        { symbol: "α", name: "Alpha", category: "希腊字母" },
        { symbol: "β", name: "Beta", category: "希腊字母" },
        { symbol: "γ", name: "Gamma", category: "希腊字母" },
        { symbol: "←", name: "左箭头", category: "箭头" },
        { symbol: "→", name: "右箭头", category: "箭头" },
        { symbol: "↑", name: "上箭头", category: "箭头" },
        { symbol: "↓", name: "下箭头", category: "箭头" },
        { symbol: "😀", name: "笑脸", category: "emoji" },
        { symbol: "😂", name: "笑到哭", category: "emoji" },
        { symbol: "😊", name: "微笑", category: "emoji" },
        { symbol: "$", name: "美元", category: "货币" },
        { symbol: "€", name: "欧元", category: "货币" },
        { symbol: "¥", name: "人民币/日元", category: "货币" },
        { symbol: "©", name: "版权符号", category: "特殊" },
        { symbol: "®", name: "注册商标", category: "特殊" },
        { symbol: "™", name: "商标符号", category: "特殊" }
    ];
}

// 更新 UI
function updateUI() {
    renderCategories();
    renderSymbols();
    updateCounts();
}

// 更新字符计数
function updateCounts() {
    const filteredSymbols = filterSymbols();
    symbolCountElement.textContent = filteredSymbols.length;
    categoryCountElement.textContent = filteredSymbols.length;
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
        showFeedbackDialog();
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
        }
    });
}

// 处理搜索
function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase().trim();
    clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
    renderSymbols();
    updateCounts();
}

// 显示反馈对话框
function showFeedbackDialog() {
    const feedbackText = `如果您发现了任何问题或有改进建议，请通过以下方式反馈：
    
1. 字符错误或缺失
2. 功能建议
3. 界面改进意见

您可以将反馈发送到: feedback@example.com

或者直接在GitHub上提交Issue。`;
    
    alert(feedbackText);
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
    currentCategoryElement.textContent = category === 'all' ? '所有字符' : category;
    
    renderSymbols();
    updateCounts();
}

// 渲染分类列表
function renderCategories() {
    // 计算每个分类的符号数量
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

// 过滤符号
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
            
            // 检查符号本身
            if (symbol.symbol && symbol.symbol.toLowerCase().includes(searchQuery)) {
                return true;
            }
            
            // 检查关键词
            if (symbol.keywords && Array.isArray(symbol.keywords)) {
                return symbol.keywords.some(keyword => 
                    keyword.toLowerCase().includes(searchQuery)
                );
            }
            
            // 检查描述
            if (symbol.description && symbol.description.toLowerCase().includes(searchQuery)) {
                return true;
            }
            
            return false;
        });
    }
    
    return filteredSymbols;
}

// 渲染符号
function renderSymbols() {
    const filteredSymbols = filterSymbols();
    
    // 显示/隐藏无结果消息
    if (filteredSymbols.length === 0) {
        noResultsElement.style.display = 'block';
        symbolsContainer.style.display = 'none';
        return;
    }
    
    noResultsElement.style.display = 'none';
    symbolsContainer.style.display = 'grid';
    
    // 清空容器
    symbolsContainer.innerHTML = '';
    
    // 渲染符号卡片
    filteredSymbols.forEach(symbol => {
        const card = document.createElement('div');
        card.className = 'symbol-card';
        
        // 准备描述文本
        const description = symbol.description || '';
        const categoryBadge = symbol.category ? `<div class="symbol-category">${symbol.category}</div>` : '';
        
        card.innerHTML = `
            ${categoryBadge}
            <div class="symbol-char" title="点击两次可复制">${symbol.symbol}</div>
            <div class="symbol-name">${symbol.name || '未命名字符'}</div>
            ${description ? `<div class="symbol-desc">${description}</div>` : ''}
            <button class="copy-btn" data-symbol="${symbol.symbol}">
                <i class="far fa-copy"></i> 复制
            </button>
        `;
        
        symbolsContainer.appendChild(card);
        
        // 添加复制功能
        const copyBtn = card.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => copySymbol(symbol.symbol, copyBtn));
        
        // 双击卡片直接复制
        card.addEventListener('dblclick', () => copySymbol(symbol.symbol, copyBtn));
    });
}

// 复制符号到剪贴板
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
        // 降级方案：使用document.execCommand
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
        <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #dc3545;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h3>加载数据失败</h3>
            <p>${message}</p>
            <button id="retryLoad" class="copy-btn" style="margin-top: 1rem; background-color: #4361ee;">
                <i class="fas fa-redo"></i> 重试加载
            </button>
        </div>
    `;
    
    // 添加重试按钮事件
    const retryBtn = document.getElementById('retryLoad');
    if (retryBtn) {
        retryBtn.addEventListener('click', async () => {
            retryBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
            await loadSymbolsFromJSON();
            updateUI();
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
    const buttonText = newTheme === 'dark' ? '切换浅色模式' : '切换深色模式';
    toggleDarkModeBtn.textContent = buttonText;
}

// 更新主题
function updateTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // 更新按钮文本
    const buttonText = savedTheme === 'dark' ? '切换浅色模式' : '切换深色模式';
    toggleDarkModeBtn.textContent = buttonText;
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

// 导出函数供测试使用（如果需要在控制台测试）
if (typeof window !== 'undefined') {
    window.app = {
        loadSymbolsFromJSON,
        filterSymbols,
        copySymbol,
        setActiveCategory,
        getSymbolCount: () => allSymbols.length,
        getCategoryCount: () => categories.length
    };
}
