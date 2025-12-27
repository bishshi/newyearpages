/**
 * 2026 马年大吉 - 核心逻辑脚本 (完全修复版)
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

// --- 0. URL参数解析与动态渲染 ---
function initGreeting() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name') || '好友';
    const from = params.get('from') || '你的老友';
    const id = params.get('id') || 'zxh';

    // 1. 修改浏览器标签页标题
    document.title = `给 ${name} 的 2026 马年贺卡`;

    // 2. 修改首页大标题
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.innerText = `🐎 送给 ${name} 的贺卡`;

    // 3. 修改收件人名字
    const userEl = document.getElementById('userName');
    if (userEl) userEl.innerText = name;

    // 4. 修改所有发件人落款 (msgFrom 和 finalFrom)
    const fromIds = ['msgFrom', 'finalFrom'];
    fromIds.forEach(idKey => {
        const el = document.getElementById(idKey);
        if (el) el.innerText = from;
    });

    // 5. 修改跳转按钮 URL
    const jumpBtn = document.querySelector('.jump-card');
    if (jumpBtn) {
        const targetUrl = `lottery.html?id=${id}&name=${encodeURIComponent(name)}&from=${encodeURIComponent(from)}`;
        jumpBtn.onclick = () => handleJump(targetUrl);
    }
}

// 确保 DOM 加载完就执行
document.addEventListener('DOMContentLoaded', initGreeting);

// --- 1. 分页切换逻辑 ---
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

// --- 2. 滑动与交互控制 ---
document.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
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

// --- 3. 倒计时逻辑 ---
function updateCountdown() {
    const target = new Date(2026, 1, 17, 0, 0, 0).getTime(); 
    const now = new Date().getTime();
    const gap = target - now;
    if (gap <= 0 || !document.getElementById('days')) return;
    document.getElementById('days').innerText = Math.floor(gap / 86400000).toString().padStart(2, '0');
    document.getElementById('hours').innerText = Math.floor((gap % 86400000) / 3600000).toString().padStart(2, '0');
    document.getElementById('minutes').innerText = Math.floor((gap % 3600000) / 60000).toString().padStart(2, '0');
    document.getElementById('seconds').innerText = Math.floor((gap % 60000) / 1000).toString().padStart(2, '0');
}
setInterval(updateCountdown, 1000);

// --- 4. 烟花效果 ---
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

// --- 5. 音乐与跳转 ---
function toggleMusic() {
    if (audio.paused) { audio.play(); musicIcon.style.animation = 'rotating 2s linear infinite'; }
    else { audio.pause(); musicIcon.style.animation = 'none'; }
}

function handleJump(url) {
    const overlay = document.getElementById('transition-overlay');
    if(overlay) { overlay.style.opacity = '1'; overlay.style.pointerEvents = 'all'; }
    setTimeout(() => { window.location.href = url; }, 800);
}

// --- 6. Twikoo 初始化 ---
if (typeof twikoo !== 'undefined') {
    twikoo.init({
        envId: 'https://comment.biss.click', 
        el: '#tcomment',
        path: '2026-greeting', 
        placeholder: '在此留下你的新年祝福吧...',
    });
}