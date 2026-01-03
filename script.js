// 全局变量
let allSymbols = [];
let currentCategory = 'all';
let searchMode = 'all';
let searchQuery = '';

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

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadSymbols();
    setupEventListeners();
    updateTheme();
});

// 加载符号数据
async function loadSymbols() {
    try {
        // 在实际项目中，这里应该从服务器加载JSON文件
        // const response = await fetch('symbols.json');
        // allSymbols = await response.json();
        
        // 由于在示例中，我们直接使用内联数据
        // 实际项目中，应该使用上面的fetch方法
        allSymbols = getSymbolsData();
        
        renderCategories();
        renderSymbols();
    } catch (error) {
        console.error('加载符号数据失败:', error);
        symbolsContainer.innerHTML = '<div class="error-message">无法加载符号数据，请刷新页面重试。</div>';
    }
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
    });
    
    // 搜索模式切换
    searchModeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            searchMode = e.target.value;
            renderSymbols();
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
}

// 处理搜索
function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase().trim();
    clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
    renderSymbols();
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
}

// 渲染分类列表
function renderCategories() {
    // 获取所有分类
    const categories = ['all', ...new Set(allSymbols.map(symbol => symbol.category))];
    
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
        
        li.innerHTML = `
            <button class="category-btn ${category === 'all' ? 'active' : ''}" 
                    data-category="${category}">
                ${category === 'all' ? '所有字符' : category}
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

// 渲染符号
function renderSymbols() {
    // 过滤符号
    let filteredSymbols = allSymbols;
    
    // 按分类过滤
    if (currentCategory !== 'all') {
        filteredSymbols = filteredSymbols.filter(symbol => symbol.category === currentCategory);
    }
    
    // 按搜索词过滤
    if (searchQuery) {
        const searchIn = searchMode === 'all' ? allSymbols : filteredSymbols;
        filteredSymbols = searchIn.filter(symbol => 
            symbol.name.toLowerCase().includes(searchQuery) || 
            symbol.symbol.toLowerCase().includes(searchQuery) ||
            (symbol.keywords && symbol.keywords.some(keyword => 
                keyword.toLowerCase().includes(searchQuery)
            ))
        );
    }
    
    // 更新计数
    symbolCountElement.textContent = filteredSymbols.length;
    categoryCountElement.textContent = filteredSymbols.length;
    
    // 显示/隐藏无结果消息
    if (filteredSymbols.length === 0) {
        noResultsElement.style.display = 'block';
        symbolsContainer.style.display = 'none';
        return;
    }
    
    noResultsElement.style.display = 'none';
    symbolsContainer.style.display = 'grid';
    
    // 渲染符号卡片
    symbolsContainer.innerHTML = '';
    
    filteredSymbols.forEach(symbol => {
        const card = document.createElement('div');
        card.className = 'symbol-card';
        card.innerHTML = `
            <div class="symbol-char">${symbol.symbol}</div>
            <div class="symbol-name">${symbol.name}</div>
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
        showNotification();
        
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
        showNotification();
    });
}

// 显示通知
function showNotification() {
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// 切换深色模式
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// 更新主题
function updateTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// 获取符号数据（内联数据）
function getSymbolsData() {
    // 这里只包含部分数据作为示例
    // 完整的符号数据应该在symbols.json文件中
    return [
        // 数学符号
        { symbol: "+", name: "加号", category: "数学" },
        { symbol: "-", name: "减号", category: "数学" },
        { symbol: "×", name: "乘号", category: "数学" },
        { symbol: "÷", name: "除号", category: "数学" },
        { symbol: "=", name: "等号", category: "数学" },
        { symbol: "≠", name: "不等号", category: "数学" },
        { symbol: "≈", name: "约等号", category: "数学" },
        { symbol: "≡", name: "恒等号", category: "数学" },
        { symbol: ">", name: "大于号", category: "数学" },
        { symbol: "<", name: "小于号", category: "数学" },
        { symbol: "≥", name: "大于等于号", category: "数学" },
        { symbol: "≤", name: "小于等于号", category: "数学" },
        { symbol: "±", name: "正负号", category: "数学" },
        { symbol: "∑", name: "求和符号", category: "数学" },
        { symbol: "∏", name: "求积符号", category: "数学" },
        { symbol: "√", name: "根号", category: "数学" },
        { symbol: "∞", name: "无穷大", category: "数学" },
        { symbol: "∠", name: "角", category: "数学" },
        { symbol: "°", name: "度", category: "数学" },
        { symbol: "π", name: "圆周率", category: "数学" },
        { symbol: "∫", name: "积分符号", category: "数学" },
        { symbol: "∂", name: "偏微分符号", category: "数学" },
        { symbol: "∇", name: "梯度符号", category: "数学" },
        { symbol: "∈", name: "属于", category: "数学" },
        { symbol: "∉", name: "不属于", category: "数学" },
        { symbol: "∪", name: "并集", category: "数学" },
        { symbol: "∩", name: "交集", category: "数学" },
        { symbol: "∅", name: "空集", category: "数学" },
        { symbol: "⇒", name: "蕴含", category: "数学" },
        { symbol: "⇔", name: "等价", category: "数学" },
        { symbol: "∀", name: "任意", category: "数学" },
        { symbol: "∃", name: "存在", category: "数学" },
        
        // 希腊字母
        { symbol: "α", name: "Alpha", category: "希腊字母" },
        { symbol: "β", name: "Beta", category: "希腊字母" },
        { symbol: "γ", name: "Gamma", category: "希腊字母" },
        { symbol: "δ", name: "Delta", category: "希腊字母" },
        { symbol: "ε", name: "Epsilon", category: "希腊字母" },
        { symbol: "ζ", name: "Zeta", category: "希腊字母" },
        { symbol: "η", name: "Eta", category: "希腊字母" },
        { symbol: "θ", name: "Theta", category: "希腊字母" },
        { symbol: "λ", name: "Lambda", category: "希腊字母" },
        { symbol: "μ", name: "Mu", category: "希腊字母" },
        { symbol: "π", name: "Pi", category: "希腊字母" },
        { symbol: "ρ", name: "Rho", category: "希腊字母" },
        { symbol: "σ", name: "Sigma", category: "希腊字母" },
        { symbol: "τ", name: "Tau", category: "希腊字母" },
        { symbol: "φ", name: "Phi", category: "希腊字母" },
        { symbol: "ω", name: "Omega", category: "希腊字母" },
        { symbol: "Α", name: "Alpha (大写)", category: "希腊字母" },
        { symbol: "Β", name: "Beta (大写)", category: "希腊字母" },
        { symbol: "Γ", name: "Gamma (大写)", category: "希腊字母" },
        { symbol: "Δ", name: "Delta (大写)", category: "希腊字母" },
        { symbol: "Ω", name: "Omega (大写)", category: "希腊字母" },
        
        // 音标符号
        { symbol: "ɪ", name: "短元音 i", category: "音标" },
        { symbol: "ɛ", name: "短元音 e", category: "音标" },
        { symbol: "æ", name: "短元音 ae", category: "音标" },
        { symbol: "ɑ", name: "长元音 a", category: "音标" },
        { symbol: "ɔ", name: "长元音 o", category: "音标" },
        { symbol: "ʊ", name: "短元音 u", category: "音标" },
        { symbol: "ə", name: "中性元音", category: "音标" },
        { symbol: "ʃ", name: "清辅音 sh", category: "音标" },
        { symbol: "ʒ", name: "浊辅音 zh", category: "音标" },
        { symbol: "θ", name: "清辅音 th", category: "音标" },
        { symbol: "ð", name: "浊辅音 th", category: "音标" },
        { symbol: "ŋ", name: "鼻音 ng", category: "音标" },
        
        // 拼音
        { symbol: "ā", name: "拼音 a (一声)", category: "拼音" },
        { symbol: "á", name: "拼音 a (二声)", category: "拼音" },
        { symbol: "ǎ", name: "拼音 a (三声)", category: "拼音" },
        { symbol: "à", name: "拼音 a (四声)", category: "拼音" },
        { symbol: "ō", name: "拼音 o (一声)", category: "拼音" },
        { symbol: "ó", name: "拼音 o (二声)", category: "拼音" },
        { symbol: "ǒ", name: "拼音 o (三声)", category: "拼音" },
        { symbol: "ò", name: "拼音 o (四声)", category: "拼音" },
        { symbol: "ē", name: "拼音 e (一声)", category: "拼音" },
        { symbol: "é", name: "拼音 e (二声)", category: "拼音" },
        { symbol: "ě", name: "拼音 e (三声)", category: "拼音" },
        { symbol: "è", name: "拼音 e (四声)", category: "拼音" },
        { symbol: "ī", name: "拼音 i (一声)", category: "拼音" },
        { symbol: "í", name: "拼音 i (二声)", category: "拼音" },
        { symbol: "ǐ", name: "拼音 i (三声)", category: "拼音" },
        { symbol: "ì", name: "拼音 i (四声)", category: "拼音" },
        
        // 箭头
        { symbol: "←", name: "左箭头", category: "箭头" },
        { symbol: "→", name: "右箭头", category: "箭头" },
        { symbol: "↑", name: "上箭头", category: "箭头" },
        { symbol: "↓", name: "下箭头", category: "箭头" },
        { symbol: "↔", name: "左右箭头", category: "箭头" },
        { symbol: "↕", name: "上下箭头", category: "箭头" },
        { symbol: "⇐", name: "双线左箭头", category: "箭头" },
        { symbol: "⇒", name: "双线右箭头", category: "箭头" },
        { symbol: "⇔", name: "双线左右箭头", category: "箭头" },
        
        // Emoji
        { symbol: "😀", name: "笑脸", category: "emoji" },
        { symbol: "😂", name: "笑到哭", category: "emoji" },
        { symbol: "😊", name: "微笑", category: "emoji" },
        { symbol: "😎", name: "酷", category: "emoji" },
        { symbol: "😍", name: "爱心眼", category: "emoji" },
        { symbol: "👍", name: "赞", category: "emoji" },
        { symbol: "👎", name: "踩", category: "emoji" },
        { symbol: "❤️", name: "红心", category: "emoji" },
        { symbol: "🔥", name: "火焰", category: "emoji" },
        { symbol: "⭐", name: "星星", category: "emoji" },
        { symbol: "🎉", name: "派对", category: "emoji" },
        { symbol: "✅", name: "对勾", category: "emoji" },
        { symbol: "❌", name: "叉号", category: "emoji" },
        { symbol: "⚠️", name: "警告", category: "emoji" },
        
        // 货币符号
        { symbol: "$", name: "美元", category: "货币" },
        { symbol: "€", name: "欧元", category: "货币" },
        { symbol: "£", name: "英镑", category: "货币" },
        { symbol: "¥", name: "人民币/日元", category: "货币" },
        { symbol: "₹", name: "印度卢比", category: "货币" },
        { symbol: "₽", name: "俄罗斯卢布", category: "货币" },
        
        // 特殊符号
        { symbol: "©", name: "版权符号", category: "特殊" },
        { symbol: "®", name: "注册商标", category: "特殊" },
        { symbol: "™", name: "商标符号", category: "特殊" },
        { symbol: "§", name: "章节符号", category: "特殊" },
        { symbol: "¶", name: "段落符号", category: "特殊" },
        { symbol: "†", name: "剑号", category: "特殊" },
        { symbol: "‡", name: "双剑号", category: "特殊" },
        { symbol: "•", name: "项目符号", category: "特殊" },
        { symbol: "–", name: "短破折号", category: "特殊" },
        { symbol: "—", name: "长破折号", category: "特殊" },
        
        // 几何图形
        { symbol: "■", name: "实心方形", category: "几何" },
        { symbol: "□", name: "空心方形", category: "几何" },
        { symbol: "●", name: "实心圆形", category: "几何" },
        { symbol: "○", name: "空心圆形", category: "几何" },
        { symbol: "▲", name: "实心三角形", category: "几何" },
        { symbol: "△", name: "空心三角形", category: "几何" },
        { symbol: "◆", name: "实心菱形", category: "几何" },
        { symbol: "◇", name: "空心菱形", category: "几何" },
        { symbol: "★", name: "实心星星", category: "几何" },
        { symbol: "☆", name: "空心星星", category: "几何" },
        
        // 上标下标
        { symbol: "⁰", name: "上标0", category: "上下标" },
        { symbol: "¹", name: "上标1", category: "上下标" },
        { symbol: "²", name: "上标2", category: "上下标" },
        { symbol: "³", name: "上标3", category: "上下标" },
        { symbol: "⁴", name: "上标4", category: "上下标" },
        { symbol: "⁵", name: "上标5", category: "上下标" },
        { symbol: "⁶", name: "上标6", category: "上下标" },
        { symbol: "⁷", name: "上标7", category: "上下标" },
        { symbol: "⁸", name: "上标8", category: "上下标" },
        { symbol: "⁹", name: "上标9", category: "上下标" },
        { symbol: "₀", name: "下标0", category: "上下标" },
        { symbol: "₁", name: "下标1", category: "上下标" },
        { symbol: "₂", name: "下标2", category: "上下标" },
        { symbol: "₃", name: "下标3", category: "上下标" },
        { symbol: "₄", name: "下标4", category: "上下标" },
        { symbol: "₅", name: "下标5", category: "上下标" },
        { symbol: "₆", name: "下标6", category: "上下标" },
        { symbol: "₇", name: "下标7", category: "上下标" },
        { symbol: "₈", name: "下标8", category: "上下标" },
        { symbol: "₉", name: "下标9", category: "上下标" },
        
        // 扑克花色
        { symbol: "♠", name: "黑桃", category: "扑克" },
        { symbol: "♥", name: "红心", category: "扑克" },
        { symbol: "♦", name: "方块", category: "扑克" },
        { symbol: "♣", name: "梅花", category: "扑克" },
        
        // 国际象棋
        { symbol: "♔", name: "白王", category: "国际象棋" },
        { symbol: "♕", name: "白后", category: "国际象棋" },
        { symbol: "♖", name: "白车", category: "国际象棋" },
        { symbol: "♗", name: "白象", category: "国际象棋" },
        { symbol: "♘", name: "白马", category: "国际象棋" },
        { symbol: "♙", name: "白兵", category: "国际象棋" },
        
        // 生物
        { symbol: "♂", name: "雄性符号", category: "生物" },
        { symbol: "♀", name: "雌性符号", category: "生物" },
        
        // 宗教/文化
        { symbol: "☯", name: "太极", category: "宗教文化" },
        { symbol: "☪", name: "星月", category: "宗教文化" },
        { symbol: "✡", name: "大卫之星", category: "宗教文化" },
        { symbol: "☸", name: "法轮", category: "宗教文化" },
        
        // 单位符号
        { symbol: "℃", name: "摄氏度", category: "单位" },
        { symbol: "℉", name: "华氏度", category: "单位" },
        { symbol: "µ", name: "微", category: "单位" },
        { symbol: "Å", name: "埃", category: "单位" },
    ];
}
