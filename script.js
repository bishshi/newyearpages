const track = document.getElementById('track');
const dotsContainer = document.getElementById('dots');
const pages = document.querySelectorAll('.page');
const audio = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
let currentIndex = 0;
let isPlaying = false;

// 初始化 Dots
pages.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if(i === 0) dot.classList.add('active');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
});

function updateUI() {
    track.style.transform = `translateX(-${currentIndex * 100}vw)`;
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

function moveSlide(direction) {
    currentIndex = Math.max(0, Math.min(pages.length - 1, currentIndex + direction));
    updateUI();
}

function goToSlide(index) {
    currentIndex = index;
    updateUI();
}

// 滚轮控制 (带防抖)
let wheelTimeout;
window.addEventListener('wheel', (e) => {
    if (e.target.closest('.scroll-content')) return; // 寄语内部滚动时不翻页
    if (wheelTimeout) return;
    if (Math.abs(e.deltaY) > 30) {
        moveSlide(e.deltaY > 0 ? 1 : -1);
        wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 700);
    }
}, { passive: false });

// 触摸控制
let startX = 0;
document.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive: true});
document.addEventListener('touchend', e => {
    if (e.target.closest('.scroll-content')) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) moveSlide(diff > 0 ? 1 : -1);
});

// 动态多彩烟花
function createFirework() {
    const container = document.getElementById('fireworks');
    const colors = ['#FFD700', '#FF4500', '#FF1493', '#00FFFF', '#ADFF2F'];
    const x = Math.random() * window.innerWidth;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    for (let i = 0; i < 16; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = x + 'px';
        p.style.color = color; // 用于 box-shadow
        p.style.backgroundColor = color;
        p.style.setProperty('--tx', (Math.random() * 200 - 100) + 'px');
        p.style.setProperty('--ty', (Math.random() * -300 - 50) + 'px');
        container.appendChild(p);
        setTimeout(() => p.remove(), 2000);
    }
}
setInterval(createFirework, 800);

// 音乐控制
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

// 自动播放黑科技
const playOnce = () => { if(!isPlaying) toggleMusic(); document.removeEventListener('click', playOnce); };
document.addEventListener('click', playOnce);

// 跳转渐隐动画
function handleJump(url) {
    const overlay = document.getElementById('transition-overlay');
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    setTimeout(() => {
        window.location.href = url;
    }, 800);
}

// 寄语内部滚动冲突修复
const scrollContent = document.getElementById('scrollContent');
scrollContent.addEventListener('touchmove', (e) => {
    e.stopPropagation();
}, { passive: true });