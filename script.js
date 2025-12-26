const track = document.getElementById('track');
const pages = document.querySelectorAll('.page');
const dotsContainer = document.getElementById('dots');
const audio = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
let currentIndex = 0;
let isPlaying = false;
let startX = 0;
let wheelTimeout = null;

// 初始化圆点
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

function moveSlide(dir) {
    currentIndex = Math.max(0, Math.min(pages.length - 1, currentIndex + dir));
    updateUI();
}

function goToSlide(index) {
    currentIndex = index;
    updateUI();
}

// 触摸控制 (优化了第三页的冲突)
document.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive: true});
document.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const scrollEl = e.target.closest('.scroll-content');

    // 如果在滚动区域左右大力滑动，或者不在滚动区域，则翻页
    if (!scrollEl || Math.abs(diff) > 70) {
        if (Math.abs(diff) > 50) moveSlide(diff > 0 ? 1 : -1);
    }
});

// 滚轮控制 (优化边界检测)
window.addEventListener('wheel', (e) => {
    if (wheelTimeout) return;
    const scrollEl = e.target.closest('.scroll-content');
    
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

// 倒计时逻辑
function updateCountdown() {
    const target = new Date(2026, 1, 17).getTime(); // 2026春节
    const now = new Date().getTime();
    const gap = target - now;

    if (gap <= 0) return;

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

// 烟花逻辑
function createFirework() {
    const container = document.getElementById('fireworks');
    const colors = ['#FFD700', '#FF4500', '#FF1493', '#00FFFF'];
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
setInterval(createFirework, 1000);

// 音乐与跳转
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
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    setTimeout(() => { window.location.href = url; }, 800);
}