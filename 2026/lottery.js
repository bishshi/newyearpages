// ===========================
// 1. 初始化与参数解析
// ===========================
let currentFriendName = "好朋友";

function initParams() {
    // 获取 URL 参数 (例如 ?name=小明&id=123)
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const name = params.get('name');

    const backBtn = document.getElementById('backToCard');
    const welcomeMsg = document.getElementById('welcomeMsg');
    const nameDisplay = document.getElementById('friendNameDisplay');

    // 设置返回链接
    if (id && backBtn) {
        backBtn.href = `https://newyearpages.biss.click/2026-${id}.html`;
    } else if (backBtn) {
        backBtn.style.display = 'none';
    }

    // 设置个性化名字
    if (name) {
        currentFriendName = decodeURIComponent(name);
        if (welcomeMsg) welcomeMsg.innerText = `祝 ${currentFriendName} 马年大吉！`;
        if (nameDisplay) nameDisplay.innerText = `To ${currentFriendName}：`;
    }
}

// ===========================
// 2. 抽奖核心逻辑
// ===========================
// 奖品池配置 (weight 为权重)
const prizes = [
    { name: "🍎 平安喜乐", weight: 20 },
    { name: "🧧 暴富锦鲤", weight: 15 },
    { name: "🐎 升职加薪", weight: 15 },
    { name: "💪 发量惊人", weight: 10 },
    { name: "✈️ 说走就走", weight: 10 },
    { name: "🍰 只吃不胖", weight: 10 },
    { name: "💑 桃花朵朵", weight: 10 },
    { name: "🦄 绝版好运", weight: 5 },
    { name: "🏖️ 带薪休假", weight: 5 }
];

// 点击抽奖按钮触发的函数
// 使用 window.handleDraw 显式挂载，确保 HTML onclick 能访问到
window.handleDraw = function() {
    const btn = document.getElementById('drawBtn');
    const overlay = document.getElementById('modalOverlay');
    const resultText = document.getElementById('prizeResult');

    if (!btn || !overlay || !resultText) {
        console.error("找不到关键元素，请检查 HTML ID");
        return;
    }

    // 1. 禁用按钮，修改文案
    btn.disabled = true;
    btn.innerText = "🔮 运势计算中...";
    
    // 2. 播放几组高潮烟花增加氛围
    for(let i=0; i<5; i++) {
        // 在屏幕中心偏下位置燃放
        setTimeout(() => createExplosion(window.innerWidth/2, window.innerHeight/2 + 100), i * 200);
    }

    // 3. 模拟计算延迟 (1.5秒)
    setTimeout(() => {
        // --- 加权随机算法 start ---
        const total = prizes.reduce((s, p) => s + p.weight, 0);
        let random = Math.random() * total;
        let selected = prizes[0].name;
        
        for (const p of prizes) {
            if (random < p.weight) {
                selected = p.name;
                break;
            }
            random -= p.weight;
        }
        // --- 加权随机算法 end ---

        // 4. 显示结果并弹出窗口
        resultText.innerText = selected;
        overlay.classList.add('active'); // 添加 active 类显示弹窗
        
        // 5. 恢复按钮状态
        btn.disabled = false;
        btn.innerText = "再次抽取";
    }, 1500);
}

// 关闭弹窗函数
window.closeModal = function() {
    const overlay = document.getElementById('modalOverlay');
    if(overlay) overlay.classList.remove('active');
}

// ===========================
// 3. 烟花特效逻辑
// ===========================
function createExplosion(x, y) {
    const container = document.getElementById('fireworks-container');
    if(!container) return;
    
    const particleCount = 30; // 爆炸粒子数量
    const colors = ['#FFD700', '#FF4500', '#FFFFFF', '#00FF00', '#00FFFF'];
    
    // 如果没传坐标，则随机生成
    if (!x) x = Math.random() * window.innerWidth;
    if (!y) y = Math.random() * (window.innerHeight * 0.8);
    const color = colors[Math.floor(Math.random() * colors.length)];

    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'firework-particle';
        p.style.backgroundColor = color;
        p.style.left = x + 'px';
        p.style.top = y + 'px';

        // 计算随机爆炸方向和力度 (极坐标)
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 150; 
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity + 100; // +100 增加重力下坠感

        // 设置 CSS 变量供动画使用
        p.style.setProperty('--tx', `${tx}px`);
        p.style.setProperty('--ty', `${ty}px`);

        container.appendChild(p);
        // 动画结束后移除粒子节点
        setTimeout(() => p.remove(), 1200);
    }
}
// 启动自动背景烟花
setInterval(() => createExplosion(), 800);

// ===========================
// 4. 截图保存功能 (html2canvas)
// ===========================
window.saveImage = function() {
    const element = document.getElementById('captureArea');
    const saveBtn = document.querySelector('.save-btn');
    
    // 检查插件是否加载成功
    if(typeof html2canvas === 'undefined') {
        alert("截图组件加载失败，请检查网络，或稍后再试");
        return;
    }

    saveBtn.innerText = "⏳ 生成中...";
    
    // 开始截图
    html2canvas(element, {
        backgroundColor: null, // 保持透明圆角背景
        scale: 2, // 2倍清晰度 (Retina屏适配)
        useCORS: true // 允许跨域图片
    }).then(canvas => {
        // 创建虚拟下载链接
        const link = document.createElement('a');
        link.download = `2026马年好运签-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click(); // 触发下载
        
        // 更新按钮状态
        saveBtn.innerText = "✅ 已保存";
        setTimeout(() => { saveBtn.innerHTML = "<span>📥</span> 保存图片"; }, 2000);
    }).catch(err => {
        console.error("截图失败:", err);
        alert("保存失败，请尝试手动长按截屏");
        saveBtn.innerText = "保存失败";
    });
}

// ===========================
// 5. 音乐控制逻辑
// ===========================
const audio = document.getElementById('bgMusic');
window.toggleMusic = function() {
    const musicIcon = document.getElementById('musicIcon');
    if(!audio || !musicIcon) return;

    if (audio.paused) { 
        audio.play(); 
        musicIcon.style.animation = 'rotating 2s linear infinite'; 
    } else { 
        audio.pause(); 
        musicIcon.style.animation = 'none'; 
    }
}
// 用户第一次点击页面时自动播放音乐 (解决浏览器自动播放限制)
document.addEventListener('click', () => { if(audio && audio.paused) window.toggleMusic(); }, {once: true});

// ===========================
// 6. 启动程序
// ===========================
// 页面加载完成后初始化参数
initParams();