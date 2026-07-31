/**
 * Effects - 视觉效果工具
 */

const Effects = {
    // Canvas 星空背景
    starfield: null,
    stars: [],
    ctx: null,

    // 初始化星空
    initStarfield() {
        this.starfield = document.getElementById('starfield');
        if (!this.starfield) return;

        this.ctx = this.starfield.getContext('2d');
        this.resize();

        window.addEventListener('resize', () => this.resize());

        // 生成星星
        const starCount = window.innerWidth < 768 ? 40 : 80;
        this.stars = [];
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.starfield.width,
                y: Math.random() * this.starfield.height,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 0.15 + 0.05,
                twinkle: Math.random() * Math.PI * 2,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                color: Math.random() > 0.8 ? '#FFD93D' : '#FFFFFF'
            });
        }

        this.animate();
    },

    resize() {
        if (!this.starfield) return;
        this.starfield.width = window.innerWidth;
        this.starfield.height = window.innerHeight;
    },

    animate() {
        if (!this.ctx || !this.starfield) return;

        this.ctx.clearRect(0, 0, this.starfield.width, this.starfield.height);

        for (const star of this.stars) {
            star.twinkle += star.twinkleSpeed;
            const opacity = 0.3 + Math.abs(Math.sin(star.twinkle)) * 0.7;

            star.y += star.speed;
            if (star.y > this.starfield.height) {
                star.y = 0;
                star.x = Math.random() * this.starfield.width;
            }

            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = star.color;
            this.ctx.globalAlpha = opacity;
            this.ctx.fill();

            // 大星星加光晕
            if (star.size > 1.5) {
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = star.color;
                this.ctx.globalAlpha = opacity * 0.2;
                this.ctx.fill();
            }
        }

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    },

    // 答对粒子爆炸
    particleBurst(x, y, color = '#FFD93D') {
        const container = document.createElement('div');
        container.className = 'particle-burst';
        container.style.left = x + 'px';
        container.style.top = y + 'px';
        document.body.appendChild(container);

        const colors = ['#FFD93D', '#FF6B35', '#6BCB77', '#4FC3F7', '#FFFFFF'];

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            const angle = (i / 15) * Math.PI * 2;
            const dist = 40 + Math.random() * 40;
            particle.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
            particle.style.setProperty('--ty', Math.sin(angle) * dist + 'px');

            container.appendChild(particle);
        }

        setTimeout(() => container.remove(), 700);
    },

    // 鼓励气泡
    showEncourage(text) {
        const bubble = document.createElement('div');
        bubble.className = 'encourage-bubble';
        bubble.textContent = text;
        document.body.appendChild(bubble);
        setTimeout(() => bubble.remove(), 1500);
    },

    // 随机鼓励语
    randomEncourage() {
        const phrases = ['太棒了！', 'Great!', '你是星际天才！', '完美！', 'Excellent!', '好厉害！', '满分航行！', 'Amazing!'];
        return phrases[Math.floor(Math.random() * phrases.length)];
    },

    // 随机鼓励语（答错时）
    randomRetry() {
        const phrases = ['信号有点偏，再调一调！', '差一点点，再来！', '别灰心，继续探索！', '没关系，再试一次！', '飞船需要调整，再试试！'];
        return phrases[Math.floor(Math.random() * phrases.length)];
    },

    // 抖动元素
    shake(element) {
        element.classList.add('shake');
        setTimeout(() => element.classList.remove('shake'), 400);
    }
};

window.Effects = Effects;
