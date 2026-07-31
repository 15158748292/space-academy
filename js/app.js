/**
 * App - 主应用入口
 * 负责路由、页面切换、全局状态管理
 */

const App = {
    currentRoute: '',
    routeHistory: [],

    init() {
        // 加载语音
        Audio.loadVoices();

        // 初始化星空
        Effects.initStarfield();

        // 读取存档
        const hasSave = Store.load();

        if (hasSave) {
            Store.checkDailyLogin();
            this.updateStatusbar();
            this.navigate('home');
        } else {
            this.navigate('login');
        }

        // 隐藏加载页
        setTimeout(() => {
            const loading = document.getElementById('loading');
            if (loading) loading.classList.add('hidden');
        }, 600);

        // ESC键返回
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.routeHistory.length > 1) {
                this.back();
            }
        });
    },

    // 导航
    navigate(route, params = {}) {
        this.routeHistory.push({ route, params });
        this.currentRoute = route;
        this.render(route, params);
        window.scrollTo(0, 0);
    },

    // 返回
    back() {
        if (this.routeHistory.length > 1) {
            this.routeHistory.pop();
            const prev = this.routeHistory[this.routeHistory.length - 1];
            this.currentRoute = prev.route;
            this.render(prev.route, prev.params);
            window.scrollTo(0, 0);
        }
    },

    // 回首页
    goHome() {
        this.routeHistory = [];
        this.navigate('home');
    },

    // 渲染页面
    render(route, params = {}) {
        const app = document.getElementById('app');
        app.innerHTML = '';
        app.classList.add('page-enter');
        setTimeout(() => app.classList.remove('page-enter'), 300);

        switch (route) {
            case 'login':
                this.showBreadcrumb(false);
                this.showStatusbar(false);
                LoginModule.render(app);
                break;
            case 'home':
                this.showBreadcrumb(false);
                this.showStatusbar(true);
                this.updateStatusbar();
                HomeModule.render(app);
                break;
            case 'english':
                this.showBreadcrumb(true, ['母舰', '英语星球']);
                this.showStatusbar(true);
                this.updateStatusbar();
                EnglishModule.renderSubjectPage(app);
                break;
            case 'math':
                this.showBreadcrumb(true, ['母舰', '数学星球']);
                this.showStatusbar(true);
                this.updateStatusbar();
                MathModule.renderSubjectPage(app);
                break;
            case 'writing':
                this.showBreadcrumb(true, ['母舰', '作文星球']);
                this.showStatusbar(true);
                this.updateStatusbar();
                WritingModule.renderSubjectPage(app);
                break;
            case 'badges':
                this.showBreadcrumb(true, ['母舰', '勋章墙']);
                this.showStatusbar(true);
                this.updateStatusbar();
                BadgeModule.renderBadgeWall(app);
                break;
            case 'profile':
                this.showBreadcrumb(true, ['母舰', '宇航员档案']);
                this.showStatusbar(true);
                this.updateStatusbar();
                ProfileModule.render(app);
                break;
            default:
                app.innerHTML = '<p>页面未找到</p>';
        }
    },

    // 面包屑
    showBreadcrumb(show, items = []) {
        const breadcrumb = document.getElementById('breadcrumb');
        const app = document.getElementById('app');

        if (show && items.length > 0) {
            breadcrumb.classList.remove('hidden');
            app.classList.remove('no-breadcrumb');
            let html = '';
            items.forEach((item, i) => {
                if (i === 0) {
                    html += `<a onclick="App.goHome()">${item}</a>`;
                } else if (i === items.length - 1) {
                    html += `<span class="breadcrumb-separator">›</span><span>${item}</span>`;
                } else {
                    html += `<a onclick="App.navigate('${item === '英语星球' ? 'english' : item === '数学星球' ? 'math' : item === '作文星球' ? 'writing' : 'home'}')">${item}</a>`;
                }
            });
            breadcrumb.innerHTML = html + '<span class="breadcrumb-separator">›</span><a onclick="App.back()">返回</a>';
        } else {
            breadcrumb.classList.add('hidden');
            app.classList.add('no-breadcrumb');
        }
    },

    // 状态栏
    showStatusbar(show) {
        const statusbar = document.getElementById('statusbar');
        if (show) {
            statusbar.classList.remove('hidden');
        } else {
            statusbar.classList.add('hidden');
        }
    },

    // 更新状态栏
    updateStatusbar() {
        if (!Store.data) return;
        const player = Store.data.player;
        const levelInfo = Scoring.getLevelInfo();

        document.getElementById('statusbar-avatar').textContent = player.avatar;
        document.getElementById('statusbar-name').textContent = player.name;
        document.getElementById('statusbar-level').textContent = `Lv.${levelInfo.current.level} ${levelInfo.current.name}`;
        document.getElementById('statusbar-score').textContent = player.totalScore;
    },

    // 关闭升级弹窗
    closeLevelup() {
        document.getElementById('levelup-overlay').classList.add('hidden');
        this.updateStatusbar();
    },

    // 关闭勋章弹窗
    closeBadgePopup() {
        document.getElementById('badge-overlay').classList.add('hidden');
    },

    // 创建鼓励语
    encourage() {
        Effects.showEncourage(Effects.randomEncourage());
    }
};

// 启航舱（登录页）
const LoginModule = {
    avatars: ['👨‍🚀', '👩‍🚀', '🧑‍🚀', '👶'],
    selectedAvatar: '👨‍🚀',

    render(container) {
        container.innerHTML = `
            <div class="login-container">
                <div class="login-logo">🚀</div>
                <h1 class="login-title">星际学园</h1>
                <p class="login-desc">欢迎来到太空学习冒险！</p>
                <div class="login-form">
                    <div>
                        <p style="margin-bottom:10px;color:var(--color-text-secondary);">选择你的宇航员形象：</p>
                        <div class="avatar-selector" id="avatar-selector">
                            ${this.avatars.map(a => `<div class="avatar-option ${a === this.selectedAvatar ? 'selected' : ''}" onclick="LoginModule.selectAvatar('${a}', this)">${a}</div>`).join('')}
                        </div>
                    </div>
                    <input type="text" class="input-field" id="player-name" placeholder="输入你的名字..." maxlength="8">
                    <button class="btn btn-primary btn-large" onclick="LoginModule.start()">开始太空冒险 🚀</button>
                </div>
            </div>
        `;
    },

    selectAvatar(avatar, el) {
        this.selectedAvatar = avatar;
        document.querySelectorAll('.avatar-option').forEach(e => e.classList.remove('selected'));
        el.classList.add('selected');
        Audio.playClick();
    },

    start() {
        const name = document.getElementById('player-name').value.trim();
        if (!name) {
            const input = document.getElementById('player-name');
            input.style.borderColor = 'var(--color-error)';
            input.placeholder = '请先输入名字哦！';
            Effects.shake(input);
            return;
        }

        Audio.init();
        Audio.playComplete();
        Store.createPlayer(name, this.selectedAvatar);
        App.navigate('home');
    }
};

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// 暴露到全局
window.App = App;
window.LoginModule = LoginModule;
