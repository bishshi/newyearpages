/**
 * 2026 马年倒计时核心逻辑
 */

// 1. 设置目标时间：2026年春节 (2月17日)
const targetDate = new Date('2026-02-17T00:00:00');
const today = new Date();

// 2. 倒计时更新函数
function updateTimer() {
    const now = new Date();
    const diff = targetDate - now;

    // 如果时间到达 0
    if (diff <= 0) {
        document.getElementById('app').innerHTML = `
            <div class="year-text" style="font-size:18vw">马年大吉</div>
            <div style="font-size:6vw; color:var(--gold)">🐎 万事如意 🐎</div>
        `;
        return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    // 更新 DOM
    document.getElementById('d').innerText = d.toString().padStart(2, '0');
    document.getElementById('h').innerText = h.toString().padStart(2, '0');
    document.getElementById('m').innerText = m.toString().padStart(2, '0');
    document.getElementById('s').innerText = s.toString().padStart(2, '0');

    // 智能切换：如果不足 24 小时，进入冲刺模式
    if (d < 1) {
        document.getElementById('app').classList.add('state-final-day');
    } else {
        document.getElementById('app').classList.remove('state-final-day');
    }
}

// 3. 动态生成日历
function initCalendar() {
    const container = document.getElementById('container');
    const viewport = document.getElementById('viewport');
    
    // 获取需要展示的月份
    const months = [];
    let curr = new Date(today.getFullYear(), today.getMonth(), 1);
    while (curr <= targetDate) {
        months.push(new Date(curr));
        curr.setMonth(curr.getMonth() + 1);
    }

    months.forEach(mDate => {
        const page = document.createElement('div');
        page.className = 'month-page';
        page.innerHTML = `<div class="month-name">${mDate.getFullYear()}年 ${mDate.getMonth() + 1}月</div>`;
        
        const grid = document.createElement('div');
        grid.className = 'grid';
        
        // 渲染星期头
        ['日','一','二','三','四','五','六'].forEach(w => {
            grid.innerHTML += `<div style="text-align:center; font-size:1rem; color:#999; padding-bottom:8px; font-weight:bold">${w}</div>`;
        });

        const firstDay = new Date(mDate.getFullYear(), mDate.getMonth(), 1).getDay();
        const totalDays = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 0).getDate();

        // 填充空白
        for(let i=0; i<firstDay; i++) grid.appendChild(document.createElement('div'));

        // 渲染日期
        for(let d=1; d<=totalDays; d++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.innerText = d;

            // 标注春节 (2026-02-17)
            if (mDate.getFullYear() === 2026 && mDate.getMonth() === 1 && d === 17) {
                cell.classList.add('target-day');
            }

            // 标注已过去的天数 (红灯笼)
            if (mDate.getFullYear() === today.getFullYear() && 
                mDate.getMonth() === today.getMonth() && d < today.getDate()) {
                cell.innerHTML += `<div class="lantern-icon"></div>`;
                cell.classList.add('passed');
            }
            grid.appendChild(cell);
        }
        page.appendChild(grid);
        container.appendChild(page);
    });

    // 滚轮控制逻辑：单次滚动翻一整月
    let isScrolling = false;
    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (isScrolling) return;
        isScrolling = true;
        const direction = e.deltaY > 0 ? 1 : -1;
        movePage(direction);
        setTimeout(() => { isScrolling = false; }, 400); 
    }, { passive: false });
}

// 4. 翻页控制
function movePage(dir) {
    const v = document.getElementById('viewport');
    v.scrollBy({ left: dir * v.offsetWidth, behavior: 'smooth' });
}

// 5. 烟花背景粒子引擎
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let particles = [];

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
window.onresize();

class Particle {
    constructor(x, y) {
        this.x = x; this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1;
        this.color = `hsl(${Math.random() * 50 + 10}, 100%, 65%)`;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.vy += 0.06; // 重力感
        this.life -= 0.015;
    }
    draw() {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function loop() {
    ctx.fillStyle = 'rgba(74, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (Math.random() < 0.05) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height / 2.5;
        for (let i = 0; i < 30; i++) particles.push(new Particle(x, y));
    }
    
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
}

// 启动程序
initCalendar();
setInterval(updateTimer, 1000);
updateTimer();
loop();