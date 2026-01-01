// --- 1. 核心逻辑与绑定 ---

// 确保在页面加载完成后再执行初始化，防止报错
document.addEventListener('DOMContentLoaded', function() {
    initParams();
    startFireworks(); // 启动背景烟花
    initMusic();      // 初始化音乐
});

// --- 2. 参数与初始化 ---
let currentFriendName = "好朋友";

function initParams() {
    // 检查元素是否存在，防止报错
    const backBtn = document.getElementById('backToCard');
    const welcomeMsg = document.getElementById('welcomeMsg');
    const nameDisplay = document.getElementById('friendNameDisplay');

    if (!backBtn || !welcomeMsg) return; // 如果找不到元素就停止

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const name = params.get('name');

    if (id) {
        backBtn.href = `https://newyearpages.biss.click/2026-${id}.html`;
    } else {
        backBtn.style.display = 'none';
    }

    if (name) {
        currentFriendName = decodeURIComponent(name);
        welcomeMsg.innerText = `祝 ${currentFriendName} 马年大吉！`;
        nameDisplay.innerText = `To ${currentFriendName}：`;
    }
}

// --- 3. 抽奖逻辑 ---
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

// 将函数挂载到 window 对象，确保 HTML 中的 onclick 能找到它
window.handleDraw = function() {
    const btn = document.getElementById('drawBtn');
    const modal = document.getElementById('modalOverlay');
    const resultText = document.getElementById('prizeResult');

    if(!btn || !modal || !resultText) {
        console.error("找不到关键元素，请检查HTML ID");
        return;
    }

    btn.disabled = true;
    btn.innerText = "🔮 运势计算中...";
    
    // 播放点击高潮烟花
    for(let i=0; i<5; i++) {
        setTimeout(() => createExplosion(window.innerWidth/2, window.innerHeight/2 + 100), i * 200);
    }

    setTimeout(() => {
        // 计算权重
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

        // 显示结果
        resultText.innerText = selected;
        modal.classList.add('active'); // 确保 style.css 中有 .modal-overlay.active
        
        btn.disabled = false;
        btn.innerText = "再次抽取";
    }, 1500);
}

window.closeModal = function() {
    const modal = document.getElementById('modalOverlay');
    if(modal) modal.classList.remove('active');
}

// --- 4. 烟花逻辑 ---
function createExplosion(x, y) {
    const container = document.getElementById('fireworks-container');
    if (!container) return;

    const particleCount = 30; 
    const colors = ['#FFD700', '#FF4500', '#FFFFFF', '#00FF00', '#00FFFF'];
    
    if (!x) x = Math.random() * window.innerWidth;
    if (!y) y = Math.random() * (window.innerHeight * 0.8);

    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'firework-particle';
        p.style.backgroundColor = color;
        p.style.left = x + 'px';
        p.style.top = y + 'px';

        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 150; 
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity + 100; 

        p.style.setProperty('--tx', `${tx}px`);
        p.style.setProperty('--ty', `${ty}px`);

        container.appendChild(p);
        setTimeout(() => p.remove(), 1200);
    }
}

function startFireworks() {
    setInterval(() => createExplosion(), 800);
}

// --- 5. 截图保存 ---
window.saveImage = function() {
    const element = document.getElementById('captureArea');
    const saveBtn = document.querySelector('.save-btn');
    
    if (typeof html2canvas === 'undefined') {
        alert("截图插件加载失败，请检查网络或稍后重试");
        return;
    }

    saveBtn.innerText = "⏳ 生成中...";
    
    html2canvas(element, {
        backgroundColor: null, 
        scale: 2, 
        useCORS: true 
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `2026马年好运签-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        saveBtn.innerText = "✅ 已保存";
        setTimeout(() => { saveBtn.innerHTML = "<span>📥</span> 保存图片"; }, 2000);
    }).catch(err => {
        console.error(err);
        alert("图片生成失败，请尝试截屏保存");
        saveBtn.innerText = "保存失败";
    });
}

// --- 6. 音乐控制 ---
function initMusic() {
    const audio = document.getElementById('bgMusic');
    const musicIcon = document.getElementById('musicIcon');
    
    if(!audio) return;

    window.toggleMusic = function() {
        if (audio.paused) { 
            audio.play(); 
            if(musicIcon) musicIcon.style.animation = 'rotating 2s linear infinite'; 
        } else { 
            audio.pause(); 
            if(musicIcon) musicIcon.style.animation = 'none'; 
        }
    }
    document.addEventListener('click', () => { if(audio.paused) window.toggleMusic(); }, {once: true});
}