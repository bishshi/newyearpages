const targetDateStr = '2026-02-17T00:00:00';
const targetTime = new Date(targetDateStr).getTime();
let isNearMode = false;

// --- 1. 烟花引擎逻辑 ---
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor(x, y, color) {
        this.x = x; this.y = y; this.color = color;
        this.velocity = { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 };
        this.alpha = 1;
        this.friction = 0.95;
    }
    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}

function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height * 0.6);
    const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    for (let i = 0; i < 40; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function animate() {
    ctx.fillStyle = 'rgba(42, 0, 0, 0.2)'; // 形成拖尾效果
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, i) => {
        if (p.alpha > 0) {
            p.update();
            p.draw();
        } else {
            particles.splice(i, 1);
        }
    });
    
    if (Math.random() < 0.03) createFirework(); // 随机发射
    requestAnimationFrame(animate);
}
animate();

function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetTime - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    // 逻辑判定：是否进入“最后七天”模式
    if (days < 7 && !isNearMode) {
        isNearMode = true;
        document.body.classList.add('near-target');
        renderCalendar(); // 切换模式后重新渲染日历
    }

    if (diff <= 0) {
        document.querySelector('.countdown-timer').innerHTML = "新年快乐！马年大吉";
        return;
    }

    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    document.getElementById('d').innerText = days.toString().padStart(2, '0');
    document.getElementById('h').innerText = h.toString().padStart(2, '0');
    document.getElementById('m').innerText = m.toString().padStart(2, '0');
    document.getElementById('s').innerText = s.toString().padStart(2, '0');
}

let viewDate = new Date();
const today = new Date();
const targetDay = new Date(targetDateStr);

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const title = document.getElementById('monthTitle');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    grid.innerHTML = '';

    if (isNearMode) {
        // --- 最后七天模式：只显示 7 个格子 ---
        title.innerText = "新春倒计时周期";
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';

        // 计算从今天开始的 7 天
        for (let i = 0; i < 7; i++) {
            const cur = new Date();
            cur.setDate(today.getDate() + i);
            
            const el = document.createElement('div');
            el.className = 'day';
            el.innerText = cur.getDate();
            
            if (cur.toDateString() === today.toDateString()) el.classList.add('today');
            if (cur.toDateString() === targetDay.toDateString()) el.classList.add('target');
            
            grid.appendChild(el);
        }
    } else {
        // --- 正常日历模式 ---
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        title.innerText = `${year}年 ${month + 1}月`;
        
        ['日','一','二','三','四','五','六'].forEach(w => {
            const div = document.createElement('div'); div.className = 'day';
            div.style.background = 'none'; div.innerText = w; grid.appendChild(div);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        for(let i=0; i<firstDay; i++) grid.appendChild(document.createElement('div'));

        for(let i=1; i<=lastDate; i++) {
            const el = document.createElement('div');
            el.className = 'day';
            el.innerText = i;
            const cur = new Date(year, month, i);
            if(cur.toDateString() === today.toDateString()) el.classList.add('today');
            if(cur.toDateString() === targetDay.toDateString()) el.classList.add('target');
            if(cur < today && cur.toDateString() !== today.toDateString()) el.classList.add('past');
            grid.appendChild(el);
        }

        prevBtn.disabled = (year === today.getFullYear() && month === today.getMonth());
        nextBtn.disabled = (year === targetDay.getFullYear() && month === targetDay.getMonth());
    }
}

document.getElementById('prev').onclick = () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); };
document.getElementById('next').onclick = () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); };

setInterval(updateCountdown, 1000);
updateCountdown();
renderCalendar();