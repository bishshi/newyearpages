/**
 * 背景粒子系统
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
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.life = Math.random() * 100;
        this.color = `rgba(255, 215, 0, ${Math.random() * 0.4})`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.1;
        if (this.life <= 0) this.reset();
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    resize();
    particles = [];
    for (let i = 0; i < 60; i++) {
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
 * 页面跳转控制
 */
function setupNavigation() {
    const overlay = document.getElementById('transition-overlay');
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('http') || href.endsWith('.html')) {
                e.preventDefault();
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'all';
                setTimeout(() => {
                    window.location.href = href;
                }, 600);
            }
        });
    });
}

// 初始化
window.addEventListener('resize', resize);
init();
animate();
setupNavigation();