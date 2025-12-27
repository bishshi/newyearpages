/**
 * 2026 马年大吉 - 核心逻辑脚本 (修正版)
 */

const track = document.getElementById('track');
const pages = document.querySelectorAll('.page');
const dotsContainer = document.getElementById('dots');
const audio = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');

let currentIndex = 0;
let isPlaying = false;
let startX = 0;
let wheelTimeout = null;

// --- 0. URL参数解析与动态渲染 (核心修复部分) ---
function initGreetingParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 1. 获取参数 & 设置缺省值
    const nameParam = urlParams.get('name') || '亲爱的朋友'; 
    const fromParam = urlParams.get('from') || '你的老友'; 
    const idParam = urlParams.get('id') || 'zxh';

    // 2. 渲染【收件人】(第一页)
    const nameEl = document.getElementById('userName');
    if (nameEl) nameEl.innerText = nameParam;

    // 3. 渲染【发件人】(多处同步)
    // 查找页面中所有需要显示发件人的地方
    const fromElements = ['msgFrom', 'finalFrom'];
    fromElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = fromParam;
    });

    // 4. 动态修改跳转按钮的 URL
    const jumpBtn = document.querySelector('.jump-card');
    if (jumpBtn) {
        const targetUrl = `lottery.html?id=${idParam}&name=${encodeURIComponent(nameParam)}&from=${encodeURIComponent(fromParam)}`;
        // 绑定跳转函数
        jumpBtn.onclick = function() {
            handleJump(targetUrl);
        };
    }
}

// 页面加载完成后立即执行
document.addEventListener('DOMContentLoaded', initGreetingParams);

// --- 1. 初始化分页圆点 ---
pages.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
});

function updateUI() {
    track.style.transform = `translateX(-${currentIndex * 100}vw)`;
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

function moveSlide(dir) {
    currentIndex = Math.max(0, Math.min(pages.length - 1, currentIndex + dir));
    updateUI();
}

function goToSlide(index) {
    currentIndex = index;
    updateUI();
}

// --- 2. 交互冲突处理 (保持原样) ---
document.addEventListener('touchstart', e => { 
    startX = e.touches[0].clientX; 
}, { passive: true });

document.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const isScrollArea = e.target.closest('.scroll-content') || e.target.closest('#tcomment');
    
    if (isScrollArea) {
        if (Math.abs(diff) > 80) moveSlide(diff > 0 ? 1 : -1);
        return; 
    }
    if (Math.abs(diff) > 50) moveSlide(diff > 0 ? 1 : -1);
});

window.addEventListener('wheel', (e) => {
    if (wheelTimeout) return;
    const scrollEl = e.target.closest('.scroll-content') || e.target.closest('.tk-comments');
    if (scrollEl) {
        const isAtBottom = scrollEl.scrollHeight - scrollEl.scrollTop <= scrollEl.clientHeight + 1;
        const isAtTop = scrollEl.scrollTop === 0;
        if ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && !isAtTop)) return;
    }
    if (Math.abs(e.deltaY) > 30) {
        moveSlide(e.deltaY > 0 ? 1 : -1);
        wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 700);
    }
}, { passive: false });

// --- 3. 倒计时 ---
function updateCountdown() {
    const target = new Date(2026, 1, 17, 0, 0, 0).getTime(); 
    const now = new Date().getTime();
    const gap = target - now;
    if (gap <= 0) return;
    document.getElementById('days').innerText = Math.floor(gap / 86400000).toString().padStart(2, '0');
    document.getElementById('hours').innerText = Math.floor((gap % 86400000) / 3600000).toString().padStart(2, '0');
    document.getElementById('minutes').innerText = Math.floor((gap % 3600000) / 60000).toString().padStart(2, '0');
    document.getElementById('seconds').innerText = Math.floor((gap % 60000) / 1000).toString().padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// --- 4. 烟花 ---
function createFirework() {
    const container = document.getElementById('fireworks');
    if (!container) return;
    const colors = ['#FFD700', '#FF4500', '#FF1493', '#00FFFF', '#ADFF2F'];
    const x = Math.random() * window.innerWidth;
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = x + 'px';
        p.style.backgroundColor = color;
        p.style.setProperty('--tx', (Math.random() * 200 - 100) + 'px');
        p.style.setProperty('--ty', (Math.random() * -300 - 50) + 'px');
        container.appendChild(p);
        setTimeout(() => p.remove(), 2000);
    }
}
setInterval(createFirework, 1200);

// --- 5. 音乐与跳转逻辑 ---
function toggleMusic() {
    if (audio.paused) {
        audio.play();
        musicIcon.style.animation = 'rotating 2s linear infinite';
    } else {
        audio.pause();
        musicIcon.style.animation = 'none';
    }
}

function handleJump(url) {
    const overlay = document.getElementById('transition-overlay');
    if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'all';
    }
    setTimeout(() => { window.location.href = url; }, 800);
}

// --- 6. Twikoo 评论区初始化 ---
if (typeof twikoo !== 'undefined') {
    twikoo.init({
        envId: 'https://comment.biss.click', 
        el: '#tcomment',
        path: '2026-greeting', 
        placeholder: '在此留下你的新年祝福吧...',
    });
}