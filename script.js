/**
 * 1. 背景粒子系统 (金色氛围)
 */
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5; // 粒子大小
        // 缓慢飘动
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.life = Math.random() * 100;
        // 金色透明度变化
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.1;
        // 边界或生命周期检查
        if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    resize();
    particles = [];
    // 粒子数量，手机端减少以优化性能
    const count = window.innerWidth < 500 ? 40 : 80;
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

/**
 * 2. 限时开启与锁定逻辑 (核心功能)
 */
function showToast(message) {
    let toast = document.getElementById('toast-msg');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-msg';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    
    if (toast.timer) clearTimeout(toast.timer);
    
    toast.timer = setTimeout(() => {
        toast.style.opacity = '0';
    }, 2500);
}

function initTimeLock() {
    const now = new Date().getTime();
    const items = document.querySelectorAll('.nav-item');

    items.forEach(item => {
        // 读取 HTML 标签上的属性
        const startStr = item.getAttribute('data-start');
        const endStr = item.getAttribute('data-end');
        const customMsg = item.getAttribute('data-msg');

        // 如果没有时间限制，直接跳过
        if (!startStr && !endStr) return;

        // 时间格式兼容性处理 (iOS Safari 不支持 "YYYY-MM-DD HH:mm:ss")
        const formatTime = (str) => str ? str.replace(/-/g, "/").replace("T", " ") : null;

        const startTime = startStr ? new Date(startStr.replace(/-/g, "/")).getTime() : 0;
        const endTime = endStr ? new Date(endStr.replace(/-/g, "/")).getTime() : Infinity;

        let isLocked = false;
        let lockMessage = "";

        // 判断逻辑
        if (now < startTime) {
            isLocked = true;
            // 如果没有自定义消息，显示默认时间提示
            lockMessage = customMsg || `该功能将于 ${startStr} 开启`;
        } else if (now > endTime) {
            isLocked = true;
            lockMessage = customMsg || "该活动已结束";
        }

        // 应用锁定效果
        if (isLocked) {
            item.classList.add('locked');
            
            // 使用捕获阶段 (capture: true) 拦截点击
            // 确保在页面跳转逻辑之前执行
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                showToast(lockMessage);
            }, true); 
        }
    });
}

/**
 * 3. 页面跳转与初始化
 */
function setupNavigation() {
    const overlay = document.getElementById('transition-overlay');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        // 只给未锁定的卡片绑定跳转动画
        // (虽然 locked 状态已经拦截了点击，但这样写更严谨)
        if(!item.classList.contains('locked')) {
            item.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href !== '#' && !href.startsWith('javascript')) {
                    e.preventDefault();
                    overlay.style.opacity = '1';
                    overlay.style.pointerEvents = 'all';
                    setTimeout(() => {
                        window.location.href = href;
                    }, 600); // 等待遮罩变黑后跳转
                }
            });
        }
    });
}

// 启动
window.addEventListener('resize', resize);

// 等待 DOM 加载完毕
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    animate();
    initTimeLock();   // 先运行锁判定
    setupNavigation(); // 再绑定跳转事件
});