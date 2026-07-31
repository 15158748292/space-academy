/**
 * Store - 存档管理系统
 * 负责localStorage的读写、数据校验、状态管理
 */

const STORE_KEY = 'spaceAcademy_save';
const STORE_VERSION = '1.0';

// 默认存档数据
function createDefaultSave() {
    return {
        version: STORE_VERSION,
        player: {
            name: '',
            avatar: '👨‍🚀',
            level: 1,
            totalScore: 0,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            loginStreak: 0
        },
        progress: {
            english: {
                vocabulary: { completed: 0, correctTotal: 0, lastPlayed: null },
                sentence:   { completed: 0, correctTotal: 0, lastPlayed: null },
                listening:  { completed: 0, correctTotal: 0, lastPlayed: null },
                dialogue:   { completed: 0, correctTotal: 0, lastPlayed: null }
            },
            math: {
                fuelCalc:  { completed: 0, correctTotal: 0, lastPlayed: null },
                starRoute: { completed: 0, correctTotal: 0, lastPlayed: null },
                cipherEq:  { completed: 0, correctTotal: 0, lastPlayed: null },
                baseBuild: { completed: 0, correctTotal: 0, lastPlayed: null }
            },
            writing: {
                storyEngine:   { completed: 0, lastPlayed: null },
                wordBridge:    { completed: 0, lastPlayed: null },
                sceneHologram: { completed: 0, lastPlayed: null }
            }
        },
        badges: [],
        stories: [],  // 作文故事集
        unlockedFeatures: [],
        dailyTasks: {
            date: '',
            tasksDone: 0
        },
        settings: {
            soundEnabled: true,
            difficulty: 'auto'
        }
    };
}

const Store = {
    data: null,

    // 初始化/读取存档
    load() {
        try {
            const raw = localStorage.getItem(STORE_KEY);
            if (!raw) {
                this.data = createDefaultSave();
                return false; // 没有存档，需要创建角色
            }
            const parsed = JSON.parse(raw);
            // 简单校验
            if (!parsed.player || !parsed.progress) {
                this.data = createDefaultSave();
                return false;
            }
            this.data = parsed;
            return this.data.player.name !== ''; // 有存档且已创建角色
        } catch (e) {
            console.error('读取存档失败:', e);
            this.data = createDefaultSave();
            return false;
        }
    },

    // 保存
    save() {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.error('保存失败:', e);
        }
    },

    // 创建角色
    createPlayer(name, avatar) {
        this.data.player.name = name;
        this.data.player.avatar = avatar;
        this.checkDailyLogin();
        this.save();
    },

    // 每日登录检查
    checkDailyLogin() {
        const today = new Date().toISOString().slice(0, 10);
        const player = this.data.player;

        if (player.lastLogin !== today) {
            // 检查是否连续
            const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
            if (player.lastLogin === yesterday) {
                player.loginStreak = (player.loginStreak || 0) + 1;
            } else {
                player.loginStreak = 1;
            }
            player.lastLogin = today;

            // 每日登录奖励
            this.addScore(5, false);

            // 连续登录奖励
            if (player.loginStreak === 3) {
                this.addScore(15, false);
            } else if (player.loginStreak === 7) {
                this.addScore(30, false);
            }

            // 检查连续登录勋章
            if (player.loginStreak >= 3) {
                Scoring.unlockBadge('daily_cruiser');
            }
            if (player.loginStreak >= 7) {
                Scoring.unlockBadge('persistence_star');
            }

            this.save();
            return player.loginStreak;
        }
        return null;
    },

    // 添加积分
    addScore(amount, checkLevel = true) {
        this.data.player.totalScore += amount;
        if (checkLevel) {
            const leveledUp = Scoring.checkLevelUp();
            if (leveledUp) {
                return { leveledUp: true, newLevel: this.data.player.level };
            }
        }
        return { leveledUp: false };
    },

    // 记录完成
    recordCompletion(subject, type, correctCount, totalCount) {
        const subj = this.data.progress[subject];
        if (!subj || !subj[type]) return;

        subj[type].completed++;
        if (correctCount !== undefined) {
            subj[type].correctTotal += correctCount;
        }
        subj[type].lastPlayed = new Date().toISOString().slice(0, 10);

        // 每日任务计数
        const today = new Date().toISOString().slice(0, 10);
        if (this.data.dailyTasks.date !== today) {
            this.data.dailyTasks.date = today;
            this.data.dailyTasks.tasksDone = 0;
        }
        this.data.dailyTasks.tasksDone++;

        // 检查各类勋章
        Scoring.checkAllBadges();

        this.save();
    },

    // 保存故事
    saveStory(story) {
        story.id = 'story_' + Date.now();
        story.date = new Date().toISOString();
        this.data.stories = this.data.stories || [];
        this.data.stories.push(story);
        this.save();
    },

    // 重置存档
    reset() {
        this.data = createDefaultSave();
        localStorage.removeItem(STORE_KEY);
    },

    // 导出存档
    exportSave() {
        return JSON.stringify(this.data, null, 2);
    }
};

// 暴露到全局
window.Store = Store;
