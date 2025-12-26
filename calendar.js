// 倒计时逻辑
const targetDateStr = '2026-02-17T00:00:00';
const targetTime = new Date(targetDateStr).getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetTime - now;

    if (diff <= 0) {
        document.querySelector('.countdown-timer').innerHTML = "新年快乐！马年大吉";
        return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    document.getElementById('d').innerText = d.toString().padStart(2, '0');
    document.getElementById('h').innerText = h.toString().padStart(2, '0');
    document.getElementById('m').innerText = m.toString().padStart(2, '0');
    document.getElementById('s').innerText = s.toString().padStart(2, '0');
}

// 日历逻辑
let viewDate = new Date(); // 当前展示的月份
const today = new Date();
const targetDay = new Date(targetDateStr);

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const title = document.getElementById('monthTitle');
    grid.innerHTML = '';

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    title.innerText = `${year}年 ${month + 1}月`;

    // 填充周标题
    ['日','一','二','三','四','五','六'].forEach(w => {
        const div = document.createElement('div');
        div.className = 'weekday';
        div.innerText = w;
        grid.appendChild(div);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // 空格填充
    for(let i=0; i<firstDay; i++) grid.appendChild(document.createElement('div'));

    // 日期填充
    for(let i=1; i<=lastDate; i++) {
        const el = document.createElement('div');
        el.className = 'day';
        el.innerText = i;

        const cur = new Date(year, month, i);
        const curStr = cur.toDateString();

        if(curStr === today.toDateString()) el.classList.add('today');
        if(curStr === targetDay.toDateString()) {
            el.classList.add('target');
            el.innerText = '🏮'; // 春节当天显示大灯笼
        }
        // 标记过去的天数 (已过去的天数遮盖灯笼)
        if(cur < today && curStr !== today.toDateString()) {
            el.classList.add('past');
        }

        grid.appendChild(el);
    }

    // 智能导航控制
    const isTodayMonth = (year === today.getFullYear() && month === today.getMonth());
    const isTargetMonth = (year === targetDay.getFullYear() && month === targetDay.getMonth());
    
    document.getElementById('prev').disabled = isTodayMonth;
    document.getElementById('next').disabled = isTargetMonth;
    
    // 如果总跨度不足一个月，直接隐藏按钮
    if (isTodayMonth && isTargetMonth) {
        document.getElementById('prev').style.visibility = 'hidden';
        document.getElementById('next').style.visibility = 'hidden';
    }
}

// 初始化
document.getElementById('prev').onclick = () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); };
document.getElementById('next').onclick = () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); };

setInterval(updateCountdown, 1000);
updateCountdown();
renderCalendar();