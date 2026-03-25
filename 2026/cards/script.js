/**
 * 2026 马年大吉 - 核心逻辑脚本
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

// --- 1. 初始化分页圆点 ---
pages.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
});

function updateUI() {
    // 切换页面
    track.style.transform = `translateX(-${currentIndex * 100}vw)`;
    // 更新圆点状态
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

// --- 2. 交互冲突处理 (核心优化) ---
// 触摸控制
document.addEventListener('touchstart', e => { 
    startX = e.touches[0].clientX; 
}, { passive: true });

document.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    // 拦截判断：如果在留言板(Twikoo)或寄语滚动区域内，且不是大幅度左右滑动，则不翻页
    const isScrollArea = e.target.closest('.scroll-content') || e.target.closest('#tcomment');
    
    if (isScrollArea) {
        // 在这些区域，只有当水平滑动距离超过 80px 时才视为翻页意图
        if (Math.abs(diff) > 80) {
            moveSlide(diff > 0 ? 1 : -1);
        }
        return; 
    }

    // 普通区域滑动
    if (Math.abs(diff) > 50) {
        moveSlide(diff > 0 ? 1 : -1);
    }
});

// 滚轮控制 (处理边界溢出翻页)
window.addEventListener('wheel', (e) => {
    if (wheelTimeout) return;
    
    const scrollEl = e.target.closest('.scroll-content') || e.target.closest('.tk-comments');
    
    if (scrollEl) {
        const isAtBottom = scrollEl.scrollHeight - scrollEl.scrollTop <= scrollEl.clientHeight + 1;
        const isAtTop = scrollEl.scrollTop === 0;
        // 如果没滚到头或到底，不翻页，让元素内部滚动
        if ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && !isAtTop)) return;
    }

    if (Math.abs(e.deltaY) > 30) {
        moveSlide(e.deltaY > 0 ? 1 : -1);
        wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 700);
    }
}, { passive: false });


// --- 3. 倒计时逻辑 ---
function updateCountdown() {
    // 注意：JS中月份从0开始，1代表2月
    const target = new Date(2026, 1, 17, 0, 0, 0).getTime(); 
    const now = new Date().getTime();
    const gap = target - now;

    const daysEl = document.getElementById('days');
    if (!daysEl || gap <= 0) return;

    const d = Math.floor(gap / (1000 * 60 * 60 * 24));
    const h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((gap % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = d.toString().padStart(2, '0');
    document.getElementById('hours').innerText = h.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = m.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = s.toString().padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();


// --- 4. 烟花特效 ---
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
        p.style.boxShadow = `0 0 8px ${color}`;
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
        isPlaying = true;
    } else {
        audio.pause();
        musicIcon.style.animation = 'none';
        isPlaying = false;
    }
}

function handleJump(url) {
    const overlay = document.getElementById('transition-overlay');
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    setTimeout(() => {
        window.location.href = url;
    }, 800);
}


// --- 6. 初始化 Twikoo 留言板 ---
// 请确保在 HTML 中引入了 twikoo.all.min.js
if (typeof twikoo !== 'undefined') {
    twikoo.init({
        envId: 'https://comment.biss.click', // 替换为你部署后的 envId
        el: '#tcomment',
        path: '2026-greeting', // 固定的路径名，防止留言走丢
        placeholder: '在此留下你的新年祝福吧...',
    });
}