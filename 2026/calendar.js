/**
 * 2026 丙午马年倒计时 - 完整逻辑版
 */

// --- 1. 配置数据 ---
// 目标：2026年春节 (2月17日)
const targetDate = new Date(2026, 1, 17, 0, 0, 0); 

// 节日映射表 (格式：Year-MonthIndex-Day)
// 注意：MonthIndex 从 0 开始 (0=1月, 1=2月...)
const festivals = {
    '2026-0-26': { name: '腊八', type: 'sub' },  // 1月26日
    '2026-1-10': { name: '小年', type: 'sub' },  // 2月10日
    '2026-1-16': { name: '除夕', type: 'sub' },  // 2月16日
    '2026-1-17': { name: '春节', type: 'main' }, // 2月17日
    '2026-2-3':  { name: '元宵', type: 'sub' },  // 3月3日
    '2026-2-20': { name: '龙抬头', type: 'sub'}  // 3月20日
};

const dom = {
    app: document.getElementById('app'),
    d: document.getElementById('d'),
    h: document.getElementById('h'),
    m: document.getElementById('m'),
    s: document.getElementById('s')
};

// --- 2. 倒计时引擎 ---
function updateTimer() {
    const now = new Date();
    const diff = targetDate - now;

    // 结束状态
    if (diff <= 0) {
        dom.app.innerHTML = `
            <div class="year-text" style="font-size:18vw">马年大吉</div>
            <div style="font-size:6vw; color:var(--gold)">🐎 万事如意 🐎</div>
        `;
        return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    // 刷新数字
    dom.d.innerText = d.toString().padStart(2, '0');
    dom.h.innerText = h.toString().padStart(2, '0');
    dom.m.innerText = m.toString().padStart(2, '0');
    dom.s.innerText = s.toString().padStart(2, '0');

    // 冲刺模式 (最后24小时)
    if (d < 1) {
        dom.app.classList.add('state-final-day');
    } else {
        dom.app.classList.remove('state-final-day');
    }
}

// --- 3. 日历生成逻辑 ---
function initCalendar() {
    const container = document.getElementById('container');
    const viewport = document.getElementById('viewport');
    const today = new Date();
    
    // 生成月份：从今天开始，直到2026年3月底 (覆盖龙抬头)
    const months = [];
    let curr = new Date(today.getFullYear(), today.getMonth(), 1);
    const limitDate = new Date(2026, 2, 31); 
    // 防止如果当前时间超过2026年导致无法渲染，给个最小渲染区间
    const safeLimit = limitDate > targetDate ? limitDate : new Date(targetDate.getTime() + 86400000*30);

    while (curr <= safeLimit) {
        months.push(new Date(curr));
        curr.setMonth(curr.getMonth() + 1);
    }

    months.forEach(mDate => {
        // 创建月份页
        const page = document.createElement('div');
        page.className = 'month-page';
        page.innerHTML = `<div class="month-name">${mDate.getFullYear()}年 ${mDate.getMonth() + 1}月</div>`;
        
        const grid = document.createElement('div');
        grid.className = 'grid';
        
        // 星期头
        ['日','一','二','三','四','五','六'].forEach(w => {
            grid.innerHTML += `<div style="text-align:center; font-size:1rem; color:#999; padding-bottom:8px; font-weight:bold">${w}</div>`;
        });

        // 计算日期
        const firstDay = new Date(mDate.getFullYear(), mDate.getMonth(), 1).getDay();
        const totalDays = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 0).getDate();

        // 填充月初空白
        for(let i=0; i<firstDay; i++) grid.appendChild(document.createElement('div'));

        // 填充具体日期
        for(let d=1; d<=totalDays; d++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.innerText = d;

            // 检查是否有节日
            const dateKey = `${mDate.getFullYear()}-${mDate.getMonth()}-${d}`;
            const festData = festivals[dateKey];

            if (festData) {
                if (festData.type === 'main') {
                    cell.classList.add('target-day');
                } else {
                    cell.classList.add('festival-day');
                    cell.setAttribute('data-name', festData.name);
                }
            }

            // 检查是否已过去 (红灯笼覆盖)
            const cellDate = new Date(mDate.getFullYear(), mDate.getMonth(), d);
            const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            
            if (cellDate < todayZero) {
                cell.innerHTML += `<div class="lantern-icon"></div>`;
                cell.classList.add('passed');
            }
            grid.appendChild(cell);
        }
        page.appendChild(grid);
        container.appendChild(page);
    });

    // 滚轮翻页监听
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

function movePage(dir) {
    const v = document.getElementById('viewport');
    v.scrollBy({ left: dir * v.offsetWidth, behavior: 'smooth' });
}

// --- 4. 烟花粒子特效 ---
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
        this.color = `hsl(${Math.random() * 50 + 10}, 100%, 65%)`; // 金红橙色系
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.vy += 0.06; // 重力
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
    // 拖尾效果
    ctx.fillStyle = 'rgba(74, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 随机发射烟花
    if (Math.random() < 0.05) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height / 2.5;
        for (let i = 0; i < 30; i++) particles.push(new Particle(x, y));
    }
    
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
}

// --- 5. 启动程序 ---
initCalendar();
setInterval(updateTimer, 1000);
updateTimer();
loop();