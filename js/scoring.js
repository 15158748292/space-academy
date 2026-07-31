/**
 * Scoring - 积分、等级、勋章系统
 */

// 等级定义
const LEVELS = [
    { level: 1,  name: '见习探索者',   requiredScore: 0,    unlock: '基础功能' },
    { level: 2,  name: '星际学徒',     requiredScore: 100,  unlock: '解锁听力雷达站' },
    { level: 3,  name: '太空航行者',   requiredScore: 300,  unlock: '解锁作文场景全息台' },
    { level: 4,  name: '火箭驾驶员',   requiredScore: 600,  unlock: '可选第二个宇航员头像' },
    { level: 5,  name: '星际领航员',   requiredScore: 1000, unlock: '解锁数学密码方程式高级题' },
    { level: 6,  name: '银河护卫',     requiredScore: 1500, unlock: '解锁英语对话外星人高级题' },
    { level: 7,  name: '宇宙探险家',   requiredScore: 2200, unlock: '勋章墙展示星际传说区域' },
    { level: 8,  name: '星辰大师',     requiredScore: 3000, unlock: '特殊火箭皮肤' },
    { level: 9,  name: '银河传说',     requiredScore: 4000, unlock: '全部内容解锁' },
    { level: 10, name: '宇宙之光',     requiredScore: 5500, unlock: '终极称号 + 彩蛋动画' }
];

// 勋章定义
const BADGES = {
    'explorer':       { icon: '🔭', name: '星际探索者',   desc: '首次进入三个星球各完成1组题', condition: () => {
        const p = Store.data.progress;
        return p.english.vocabulary.completed >= 1 && p.math.fuelCalc.completed >= 1 && p.writing.storyEngine.completed >= 1;
    }},
    'math_astronaut': { icon: 'π', name: '数学宇航员',   desc: '数学星球累计完成5组题', condition: () => {
        const m = Store.data.progress.math;
        return (m.fuelCalc.completed + m.starRoute.completed + m.cipherEq.completed + m.baseBuild.completed) >= 5;
    }},
    'english_translator': { icon: '🌍', name: '英语翻译官', desc: '英语星球累计完成5组题', condition: () => {
        const e = Store.data.progress.english;
        return (e.vocabulary.completed + e.sentence.completed + e.listening.completed + e.dialogue.completed) >= 5;
    }},
    'story_builder':  { icon: '📖', name: '故事建造师',   desc: '完成第一篇作文', condition: () => {
        const w = Store.data.progress.writing;
        return (w.storyEngine.completed + w.wordBridge.completed + w.sceneHologram.completed) >= 1;
    }},
    'perfect_voyage': { icon: '🎯', name: '完美航行',     desc: '任意一组题获得满分(全对)', condition: () => Store.data._lastPerfectVoyage === true },
    'daily_cruiser':  { icon: '📅', name: '每日巡航员',   desc: '连续3天登录学习', condition: () => Store.data.player.loginStreak >= 3 },
    'persistence_star': { icon: '🔥', name: '坚持之星',   desc: '连续7天登录学习', condition: () => Store.data.player.loginStreak >= 7 },
    'word_master':    { icon: '👑', name: '词汇大师',     desc: '英语词汇题累计答对50题', condition: () => Store.data.progress.english.vocabulary.correctTotal >= 50 },
    'number_decoder': { icon: '⚙️', name: '数字解码者',   desc: '数学方程式题累计答对30题', condition: () => Store.data.progress.math.cipherEq.correctTotal >= 30 },
    'little_writer':  { icon: '✒️', name: '小小作家',     desc: '累计完成5篇作文', condition: () => {
        const w = Store.data.progress.writing;
        return (w.storyEngine.completed + w.wordBridge.completed + w.sceneHologram.completed) >= 5;
    }},
    'all_subject_warrior': { icon: '🎖️', name: '全科勇士', desc: '三科各完成3组题', condition: () => {
        const p = Store.data.progress;
        const engTotal = p.english.vocabulary.completed + p.english.sentence.completed + p.english.listening.completed + p.english.dialogue.completed;
        const mathTotal = p.math.fuelCalc.completed + p.math.starRoute.completed + p.math.cipherEq.completed + p.math.baseBuild.completed;
        const writeTotal = p.writing.storyEngine.completed + p.writing.wordBridge.completed + p.writing.sceneHologram.completed;
        return engTotal >= 3 && mathTotal >= 3 && writeTotal >= 3;
    }},
    'galaxy_legend':  { icon: '👑', name: '银河传说',     desc: '达到Lv.9', condition: () => Store.data.player.level >= 9 }
};

const Scoring = {
    // 获取当前等级信息
    getLevelInfo() {
        const score = Store.data.player.totalScore;
        let currentLevel = LEVELS[0];
        let nextLevel = null;

        for (let i = 0; i < LEVELS.length; i++) {
            if (score >= LEVELS[i].requiredScore) {
                currentLevel = LEVELS[i];
                nextLevel = LEVELS[i + 1] || null;
            }
        }

        const progressToNext = nextLevel
            ? Math.min(100, Math.round((score - currentLevel.requiredScore) / (nextLevel.requiredScore - currentLevel.requiredScore) * 100))
            : 100;

        return { current: currentLevel, next: nextLevel, progressToNext };
    },

    // 检查是否升级
    checkLevelUp() {
        const info = this.getLevelInfo();
        const storedLevel = Store.data.player.level;

        if (info.current.level > storedLevel) {
            Store.data.player.level = info.current.level;
            Store.save();
            // 触发升级动画
            this.showLevelUp(info.current);
            // 检查升级相关勋章
            if (info.current.level >= 9) {
                this.unlockBadge('galaxy_legend');
            }
            return true;
        }
        return false;
    },

    // 显示升级动画
    showLevelUp(levelInfo) {
        const overlay = document.getElementById('levelup-overlay');
        const title = document.getElementById('levelup-title');
        const subtitle = document.getElementById('levelup-subtitle');
        const starsContainer = document.getElementById('levelup-stars');

        title.textContent = `Lv.${levelInfo.level} ${levelInfo.name}！`;
        subtitle.textContent = levelInfo.unlock;

        // 生成星爆效果
        starsContainer.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const star = document.createElement('div');
            star.className = 'levelup-star';
            star.textContent = ['⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 4)];
            const angle = (i / 20) * Math.PI * 2;
            const dist = 100 + Math.random() * 50;
            star.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
            star.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
            star.style.animationDelay = (Math.random() * 0.3) + 's';
            starsContainer.appendChild(star);
        }

        overlay.classList.remove('hidden');

        // 播放升级音效
        Audio.playLevelUp();
    },

    // 解锁勋章
    unlockBadge(badgeId) {
        if (!Store.data.badges.includes(badgeId)) {
            Store.data.badges.push(badgeId);
            Store.save();
            this.showBadgePopup(badgeId);
            return true;
        }
        return false;
    },

    // 检查所有勋章
    checkAllBadges() {
        for (const [id, badge] of Object.entries(BADGES)) {
            if (!Store.data.badges.includes(id) && badge.condition()) {
                this.unlockBadge(id);
            }
        }
    },

    // 标记完美航行（用于勋章判定）
    markPerfectVoyage() {
        Store.data._lastPerfectVoyage = true;
    },

    // 显示勋章弹窗
    showBadgePopup(badgeId) {
        const badge = BADGES[badgeId];
        if (!badge) return;

        const overlay = document.getElementById('badge-overlay');
        document.getElementById('badge-popup-icon').textContent = badge.icon;
        document.getElementById('badge-popup-title').textContent = badge.name;
        document.getElementById('badge-popup-desc').textContent = badge.desc;

        overlay.classList.remove('hidden');

        // 撒花效果
        this.createConfetti();

        // 播放勋章音效
        Audio.playBadge();
    },

    // 撒花
    createConfetti() {
        const container = document.getElementById('confetti-container');
        container.innerHTML = '';
        const colors = ['#FF6B35', '#FFD93D', '#6BCB77', '#4FC3F7', '#BA68C8', '#FF5959'];
        const shapes = ['🎉', '🎊', '⭐', '✨', '💫'];

        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';

            if (Math.random() > 0.6) {
                confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
                confetti.style.background = 'transparent';
                confetti.style.fontSize = (12 + Math.random() * 12) + 'px';
            }

            container.appendChild(confetti);
        }

        // 3秒后清理
        setTimeout(() => { container.innerHTML = ''; }, 4000);
    },

    // 计算题目积分
    calculateScore(subject, type, correctCount, totalCount) {
        const baseScores = {
            english: { vocabulary: 30, sentence: 40, listening: 35, dialogue: 40 },
            math:    { fuelCalc: 40, starRoute: 45, cipherEq: 45, baseBuild: 50 },
            writing: { storyEngine: 60, wordBridge: 55, sceneHologram: 70 }
        };

        const base = baseScores[subject]?.[type] || 30;
        const ratio = totalCount > 0 ? correctCount / totalCount : 0;
        let score = Math.round(base * (0.4 + ratio * 0.6)); // 40%保底+60%按正确率

        // 全对额外奖励
        if (ratio === 1) {
            score += 10;
            this.markPerfectVoyage();
        }

        return score;
    }
};

// 暴露到全局
window.Scoring = Scoring;
window.LEVELS = LEVELS;
window.BADGES = BADGES;
