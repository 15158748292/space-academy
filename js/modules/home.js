/**
 * HomeModule - 母舰首页
 */

const HomeModule = {
    render(container) {
        const levelInfo = Scoring.getLevelInfo();
        const player = Store.data.player;
        const badges = Store.data.badges;
        const totalBadges = Object.keys(BADGES).length;

        container.innerHTML = `
            <div class="home-container">
                <h1 class="home-title">星际母舰</h1>
                <p class="home-subtitle">欢迎回来，${player.name}！选择一个星球开始探索吧</p>

                <div class="planets-row">
                    <div class="planet-wrapper">
                        <div class="planet-card planet-english" onclick="App.navigate('english')">
                            <div class="planet-ring"></div>
                            <span class="planet-icon">📚</span>
                        </div>
                        <span class="planet-label">英语星球</span>
                    </div>
                    <div class="planet-wrapper">
                        <div class="planet-card planet-math" onclick="App.navigate('math')">
                            <div class="planet-ring"></div>
                            <span class="planet-icon">🔢</span>
                        </div>
                        <span class="planet-label">数学星球</span>
                    </div>
                    <div class="planet-wrapper">
                        <div class="planet-card planet-writing" onclick="App.navigate('writing')">
                            <div class="planet-ring"></div>
                            <span class="planet-icon">✍️</span>
                        </div>
                        <span class="planet-label">作文星球</span>
                    </div>
                </div>

                <div class="card" style="max-width:600px;margin:0 auto;text-align:center;">
                    <div style="display:flex;justify-content:space-around;flex-wrap:wrap;gap:16px;">
                        <div onclick="App.navigate('badges')" style="cursor:pointer;">
                            <div style="font-size:2.5rem;">🏆</div>
                            <div style="color:var(--color-star-yellow);font-family:var(--font-title);">勋章墙</div>
                            <div style="font-size:0.85rem;color:var(--color-text-secondary);">${badges.length}/${totalBadges} 已获得</div>
                        </div>
                        <div onclick="App.navigate('profile')" style="cursor:pointer;">
                            <div style="font-size:2.5rem;">📋</div>
                            <div style="color:var(--color-star-yellow);font-family:var(--font-title);">宇航员档案</div>
                            <div style="font-size:0.85rem;color:var(--color-text-secondary);">查看进度</div>
                        </div>
                    </div>
                </div>

                <div style="margin-top:30px;text-align:center;max-width:600px;margin:30px auto 0;">
                    <div class="fuel-gauge">
                        <div class="fuel-bar" style="width:${levelInfo.progressToNext}%"></div>
                    </div>
                    <p style="margin-top:8px;color:var(--color-text-secondary);font-size:0.9rem;">
                        ${levelInfo.next
                            ? `距离 Lv.${levelInfo.next.level} ${levelInfo.next.name} 还差 ${levelInfo.next.requiredScore - player.totalScore} 积分`
                            : '已达最高等级！宇宙之光！🌟'
                        }
                    </p>
                </div>
            </div>
        `;
    }
};

window.HomeModule = HomeModule;
