/**
 * ProfileModule - 宇航员档案
 */

const ProfileModule = {
    render(container) {
        const player = Store.data.player;
        const levelInfo = Scoring.getLevelInfo();
        const p = Store.data.progress;

        // 统计各科目完成数
        const engTotal = p.english.vocabulary.completed + p.english.sentence.completed + p.english.listening.completed + p.english.dialogue.completed;
        const mathTotal = p.math.fuelCalc.completed + p.math.starRoute.completed + p.math.cipherEq.completed + p.math.baseBuild.completed;
        const writeTotal = p.writing.storyEngine.completed + p.writing.wordBridge.completed + p.writing.sceneHologram.completed;
        const totalCompleted = engTotal + mathTotal + writeTotal;
        const storyCount = (Store.data.stories || []).length;

        container.innerHTML = `
            <div style="text-align:center;margin-bottom:20px;">
                <div style="font-size:5rem;">${player.avatar}</div>
                <h2 style="font-family:var(--font-title);font-size:2rem;color:var(--color-star-yellow);margin-top:10px;">${player.name}</h2>
                <p style="color:var(--color-text-secondary);">Lv.${levelInfo.current.level} ${levelInfo.current.name}</p>
            </div>

            <div class="profile-stats">
                <div class="stat-card">
                    <div class="stat-value">${player.totalScore}</div>
                    <div class="stat-label">总积分</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${Store.data.badges.length}</div>
                    <div class="stat-label">勋章数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${player.loginStreak || 0}</div>
                    <div class="stat-label">连续登录天数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalCompleted}</div>
                    <div class="stat-label">完成任务总数</div>
                </div>
            </div>

            <div class="card" style="max-width:600px;margin:20px auto;">
                <h3 style="font-family:var(--font-title);color:var(--color-star-yellow);margin-bottom:16px;">各科目进度</h3>
                <div style="display:flex;flex-direction:column;gap:16px;">
                    <div>
                        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                            <span>📚 英语星球</span>
                            <span style="color:var(--color-text-secondary);">${engTotal} 组任务</span>
                        </div>
                        <div class="fuel-gauge"><div class="fuel-bar" style="width:${Math.min(100, engTotal * 10)}%"></div></div>
                    </div>
                    <div>
                        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                            <span>🔢 数学星球</span>
                            <span style="color:var(--color-text-secondary);">${mathTotal} 组任务</span>
                        </div>
                        <div class="fuel-gauge"><div class="fuel-bar" style="width:${Math.min(100, mathTotal * 10)}%"></div></div>
                    </div>
                    <div>
                        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                            <span>✍️ 作文星球</span>
                            <span style="color:var(--color-text-secondary);">${writeTotal} 篇作品</span>
                        </div>
                        <div class="fuel-gauge"><div class="fuel-bar" style="width:${Math.min(100, writeTotal * 20)}%"></div></div>
                    </div>
                </div>
            </div>

            <div class="card" style="max-width:600px;margin:20px auto;">
                <h3 style="font-family:var(--font-title);color:var(--color-star-yellow);margin-bottom:12px;">等级进度</h3>
                <p style="color:var(--color-text-secondary);font-size:0.9rem;margin-bottom:10px;">当前：Lv.${levelInfo.current.level} ${levelInfo.current.name}</p>
                <div class="fuel-gauge"><div class="fuel-bar" style="width:${levelInfo.progressToNext}%"></div></div>
                ${levelInfo.next
                    ? `<p style="color:var(--color-text-secondary);font-size:0.85rem;margin-top:8px;">下一级：Lv.${levelInfo.next.level} ${levelInfo.next.name}（需 ${levelInfo.next.requiredScore} 积分）</p>
                       <p style="color:var(--color-star-yellow);font-size:0.85rem;margin-top:4px;">解锁：${levelInfo.next.unlock}</p>`
                    : '<p style="color:var(--color-star-yellow);margin-top:8px;">已达最高等级！🌟</p>'
                }
            </div>

            <div style="text-align:center;margin:30px 0;">
                <button class="btn btn-secondary" onclick="ProfileModule.exportSave()">导出存档</button>
            </div>
        `;
    },

    exportSave() {
        const data = Store.exportSave();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `space_academy_${Store.data.player.name}_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
};

window.ProfileModule = ProfileModule;
