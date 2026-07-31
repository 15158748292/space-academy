/**
 * WritingModule - 作文星球
 * 三种框架引导模式：故事引擎、词语星桥、场景全息台
 */

const WritingModule = {
    tasks: [
        { id: 'storyEngine',   icon: '🚀', title: '故事引擎',   desc: '选择剧情方向，续写太空故事！', type: 'storyEngine', minLevel: 1 },
        { id: 'wordBridge',    icon: '🌉', title: '词语星桥',   desc: '用关键词串联成一篇太空冒险！', type: 'wordBridge', minLevel: 1 },
        { id: 'sceneHologram', icon: '🎬', title: '场景全息台', desc: '分段填充，搭积木般拼出作文！', type: 'sceneHologram', minLevel: 3 }
    ],

    renderSubjectPage(container) {
        const progress = Store.data.progress.writing;
        const levelInfo = Scoring.getLevelInfo();
        const stories = Store.data.stories || [];

        let tasksHtml = '';
        for (const task of this.tasks) {
            const locked = levelInfo.current.level < task.minLevel;
            const completed = progress[task.id].completed;
            tasksHtml += `
                <div class="task-card ${locked ? 'locked' : ''}" ${locked ? '' : `onclick="WritingModule.startTask('${task.id}')"`}>
                    <div class="task-card-icon">${task.icon}</div>
                    <div class="task-card-title">${task.title}</div>
                    <div class="task-card-desc">${task.desc}</div>
                    ${completed > 0 ? `<div class="task-card-badge">已写 ${completed} 篇</div>` : ''}
                    ${locked ? `<div class="task-card-lock">🔒</div>` : ''}
                </div>
            `;
        }

        // 故事集
        let storiesHtml = '';
        if (stories.length > 0) {
            storiesHtml = `
                <div style="max-width:800px;margin:40px auto;">
                    <h3 style="font-family:var(--font-title);color:var(--color-star-yellow);margin-bottom:16px;">📖 星际故事集</h3>
                    <div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:10px;">
                        ${stories.slice(-5).reverse().map(s => `
                            <div class="card" style="min-width:200px;cursor:pointer;" onclick="WritingModule.viewStory('${s.id}')">
                                <div style="font-size:2rem;margin-bottom:8px;">${s.icon || '📝'}</div>
                                <div style="font-family:var(--font-title);color:var(--color-star-yellow);font-size:1rem;margin-bottom:4px;">${s.title}</div>
                                <div style="font-size:0.8rem;color:var(--color-text-secondary);">${s.date.slice(0,10)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="subject-page">
                <div class="subject-header">
                    <h1 class="subject-title writing">✍️ 作文星球</h1>
                    <p class="subject-desc">有框架有词语，写故事就像搭积木一样简单！</p>
                </div>
                <div class="task-grid">${tasksHtml}</div>
                ${storiesHtml}
            </div>
        `;
    },

    currentTask: null,
    currentFrame: null,

    startTask(taskId) {
        Audio.playClick();
        this.currentTask = this.tasks.find(t => t.id === taskId);
        const frames = WritingFrames[taskId] || [];
        const randomFrame = frames[Math.floor(Math.random() * frames.length)];
        this.currentFrame = randomFrame;

        switch (taskId) {
            case 'storyEngine':
                this.renderStoryEngine(randomFrame);
                break;
            case 'wordBridge':
                this.renderWordBridge(randomFrame);
                break;
            case 'sceneHologram':
                this.renderSceneHologram(randomFrame);
                break;
        }
    },

    // 模式一：故事引擎
    renderStoryEngine(frame) {
        let directionsHtml = frame.directions.map((d, i) =>
            `<div class="card" style="cursor:pointer;" id="dir-${i}" onclick="WritingModule.selectDirection(${i})">
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="font-size:1.5rem;">${['🌟', '🚀', '👽'][i]}</span>
                    <div>
                        <div style="font-family:var(--font-title);color:var(--color-star-yellow);">${d.label}</div>
                    </div>
                </div>
                <div id="dir-questions-${i}" class="hidden" style="margin-top:12px;padding-left:44px;color:var(--color-text-secondary);">
                    ${d.questions.map(q => `<p style="margin:6px 0;">💡 ${q}</p>`).join('')}
                </div>
            </div>`
        ).join('');

        document.getElementById('app').innerHTML = `
            <div class="question-area">
                <div class="question-story">🚀 故事引擎 — 主题：${frame.title}</div>
                <div class="card" style="background:rgba(255,217,61,0.1);border-color:rgba(255,217,61,0.3);">
                    <div style="color:var(--color-text-secondary);margin-bottom:8px;">📖 故事开头：</div>
                    <div style="font-size:1.15rem;line-height:1.7;">${frame.opening}</div>
                </div>

                <p style="margin:20px 0 12px;color:var(--color-text-secondary);">选择一个剧情方向（点击展开引导问题）：</p>
                <div id="directions">${directionsHtml}</div>

                <div id="writing-area" class="hidden" style="margin-top:20px;">
                    <p style="color:var(--color-text-secondary);margin-bottom:8px;">✍️ 在这里续写你的故事（3-5句）：</p>
                    <textarea class="textarea-field" id="story-continuation" placeholder="开始写你的太空冒险..." rows="5"></textarea>
                </div>

                <div id="ending-area" class="hidden" style="margin-top:20px;">
                    <div class="card" style="background:rgba(255,217,61,0.05);">
                        <div style="color:var(--color-text-secondary);margin-bottom:8px;">📖 故事结尾（填空完成）：</div>
                        <div style="font-size:1.1rem;line-height:1.7;">${frame.ending.replace(/___+/g, '<input type="text" class="fill-input" style="width:140px;" placeholder="...">')}</div>
                    </div>
                </div>

                <div id="final-story" class="hidden"></div>
                <div id="story-actions"></div>
            </div>
        `;
    },

    selectedDirection: -1,

    selectDirection(index) {
        Audio.playClick();
        // 隐藏所有问题，显示选中的
        document.querySelectorAll('[id^="dir-questions-"]').forEach(el => el.classList.add('hidden'));
        document.getElementById(`dir-questions-${index}`).classList.remove('hidden');
        this.selectedDirection = index;

        // 显示续写区
        document.getElementById('writing-area').classList.remove('hidden');
        document.getElementById('ending-area').classList.remove('hidden');

        // 添加完成按钮
        document.getElementById('story-actions').innerHTML = `
            <div style="text-align:center;margin-top:20px;">
                <button class="btn btn-primary btn-large" onclick="WritingModule.finishStory()">完成故事 📖</button>
            </div>
        `;
    },

    finishStory() {
        const continuation = document.getElementById('story-continuation').value.trim();
        const endingInputs = document.querySelectorAll('#ending-area .fill-input');
        const endings = Array.from(endingInputs).map(i => i.value.trim() || '...');

        if (!continuation) {
            Effects.shake(document.getElementById('story-continuation'));
            return;
        }

        const frame = this.currentFrame;
        let endingText = frame.ending;
        let idx = 0;
        endingText = endingText.replace(/_+/g, () => endings[idx++] || '...');

        const fullStory = `${frame.opening}\n\n${continuation}\n\n${endingText}`;
        const wordCount = continuation.length + endings.join('').length;

        // 计算积分
        let score = 50; // 基础分
        score += Math.floor(wordCount / 20) * 5; // 每多20字+5分
        score = Math.min(score, 80);

        Store.recordCompletion('writing', 'storyEngine', 1, 1);
        Store.addScore(score);
        Scoring.checkAllBadges();

        // 保存故事
        Store.saveStory({
            title: frame.title,
            content: fullStory,
            icon: '🚀',
            type: 'storyEngine',
            wordCount: wordCount + frame.opening.length + endingText.length
        });

        document.getElementById('final-story').classList.remove('hidden');
        document.getElementById('final-story').innerHTML = `
            <div class="card" style="background:linear-gradient(135deg,rgba(30,42,94,0.8),rgba(45,27,105,0.8));border-color:var(--color-star-yellow);margin-top:20px;">
                <h3 style="font-family:var(--font-title);color:var(--color-star-yellow);text-align:center;margin-bottom:16px;">📖 ${frame.title}</h3>
                <div style="white-space:pre-wrap;line-height:1.8;font-size:1.05rem;">${fullStory}</div>
                <div style="text-align:center;margin-top:16px;">
                    <button class="btn btn-secondary" onclick="WritingModule.readStory('${fullStory.replace(/'/g, "\\'").replace(/\n/g, '\\n')}')">🔊 朗读故事</button>
                </div>
            </div>
            <div class="result-container">
                <div class="result-icon">🎉</div>
                <h2 class="result-title">故事完成！</h2>
                <div class="result-score">+${score}</div>
                <div class="result-stats">
                    <div class="result-stat">
                        <div class="result-stat-value">${wordCount}</div>
                        <div class="result-stat-label">你写的字数</div>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-secondary" onclick="App.navigate('writing')">返回作文星球</button>
                    <button class="btn btn-primary" onclick="WritingModule.startTask('storyEngine')">再写一篇</button>
                </div>
            </div>
        `;

        document.getElementById('story-actions').innerHTML = '';
        Audio.playComplete();
        App.updateStatusbar();
    },

    readStory(text) {
        Audio.speakChinese(text);
    },

    // 模式二：词语星桥
    renderWordBridge(frame) {
        let wordsHtml = frame.words.map((w, i) =>
            `<span class="word-tag" id="wb-word-${i}" data-word="${w}">${w}</span>`
        ).join('');

        let promptsHtml = frame.prompts.map(p => `<p style="margin:6px 0;">💡 ${p}</p>`).join('');

        document.getElementById('app').innerHTML = `
            <div class="question-area">
                <div class="question-story">🌉 词语星桥 — 主题：${frame.title}</div>
                <div class="card" style="background:rgba(255,217,61,0.1);border-color:rgba(255,217,61,0.3);">
                    <div style="color:var(--color-text-secondary);margin-bottom:8px;">必须使用的词语星球：</div>
                    <div id="word-list">${wordsHtml}</div>
                </div>
                <div class="card" style="background:rgba(255,255,255,0.05);">
                    <div style="color:var(--color-text-secondary);margin-bottom:8px;">写作提示：</div>
                    ${promptsHtml}
                </div>
                <p style="color:var(--color-text-secondary);margin:20px 0 8px;">✍️ 把所有词语用进你的太空故事里：</p>
                <textarea class="textarea-field" id="wb-textarea" placeholder="开始写你的太空冒险..." rows="8" oninput="WritingModule.checkWordsUsed()"></textarea>
                <div id="wb-status" style="text-align:center;margin:12px 0;color:var(--color-text-secondary);">
                    已使用 0/${frame.words.length} 个词语
                </div>
                <div id="wb-actions"></div>
            </div>
        `;
    },

    checkWordsUsed() {
        const text = document.getElementById('wb-textarea').value;
        const words = this.currentFrame.words;
        let usedCount = 0;

        words.forEach((w, i) => {
            const el = document.getElementById(`wb-word-${i}`);
            if (text.includes(w)) {
                el.classList.add('used');
                usedCount++;
            } else {
                el.classList.remove('used');
            }
        });

        document.getElementById('wb-status').textContent = `已使用 ${usedCount}/${words.length} 个词语`;

        if (usedCount === words.length) {
            document.getElementById('wb-actions').innerHTML = `
                <div class="feedback success" style="margin-top:12px;">🎉 星桥连通！所有词语都用上了！</div>
                <div style="text-align:center;margin-top:16px;">
                    <button class="btn btn-primary btn-large" onclick="WritingModule.finishWordBridge()">完成故事 📖</button>
                </div>
            `;
        } else {
            document.getElementById('wb-actions').innerHTML = '';
        }
    },

    finishWordBridge() {
        const text = document.getElementById('wb-textarea').value.trim();
        const wordCount = text.length;

        let score = 55;
        score += Math.floor(wordCount / 20) * 5;
        score = Math.min(score, 80);

        Store.recordCompletion('writing', 'wordBridge', 1, 1);
        Store.addScore(score);
        Scoring.checkAllBadges();

        Store.saveStory({
            title: this.currentFrame.title,
            content: text,
            icon: '🌉',
            type: 'wordBridge',
            wordCount: wordCount
        });

        document.getElementById('app').innerHTML = `
            <div class="question-area">
                <div class="card" style="background:linear-gradient(135deg,rgba(30,42,94,0.8),rgba(45,27,105,0.8));border-color:var(--color-star-yellow);">
                    <h3 style="font-family:var(--font-title);color:var(--color-star-yellow);text-align:center;margin-bottom:16px;">🌉 ${this.currentFrame.title}</h3>
                    <div style="white-space:pre-wrap;line-height:1.8;font-size:1.05rem;">${text}</div>
                    <div style="text-align:center;margin-top:16px;">
                        <button class="btn btn-secondary" onclick="WritingModule.readStory('${text.replace(/'/g, "\\'").replace(/\n/g, '\\n')}')">🔊 朗读</button>
                    </div>
                </div>
                <div class="result-container">
                    <div class="result-icon">🎉</div>
                    <h2 class="result-title">星桥连通！故事完成！</h2>
                    <div class="result-score">+${score}</div>
                    <div class="result-stats">
                        <div class="result-stat">
                            <div class="result-stat-value">${wordCount}</div>
                            <div class="result-stat-label">字数</div>
                        </div>
                    </div>
                    <div class="result-actions">
                        <button class="btn btn-secondary" onclick="App.navigate('writing')">返回作文星球</button>
                        <button class="btn btn-primary" onclick="WritingModule.startTask('wordBridge')">再写一篇</button>
                    </div>
                </div>
            </div>
        `;

        Audio.playComplete();
        App.updateStatusbar();
    },

    // 模式三：场景全息台
    renderSceneHologram(frame) {
        let sectionsHtml = frame.sections.map((s, i) => `
            <div class="card" id="section-${i}">
                <h4 style="font-family:var(--font-title);color:var(--color-star-yellow);margin-bottom:8px;">${s.label}</h4>
                <p style="color:var(--color-text-secondary);margin-bottom:10px;font-size:0.95rem;">${s.prompt}</p>
                <div style="margin-bottom:10px;">
                    <span style="font-size:0.85rem;color:var(--color-text-secondary);">词语库（点击填入）：</span><br>
                    ${s.wordBank.map(w => `<span class="word-tag clickable" onclick="WritingModule.insertWord(${i}, '${w.replace(/'/g, "\\'")}', this)">${w}</span>`).join('')}
                </div>
                <textarea class="textarea-field" id="textarea-${i}" placeholder="写写这一段..." rows="3"></textarea>
            </div>
        `).join('');

        document.getElementById('app').innerHTML = `
            <div class="question-area">
                <div class="question-story">🎬 场景全息台 — 主题：${frame.title}</div>
                <p style="color:var(--color-text-secondary);margin-bottom:16px;">逐段填写，像搭积木一样拼出一篇作文！</p>
                ${sectionsHtml}
                <div id="scene-feedback"></div>
                <div style="text-align:center;margin-top:20px;">
                    <button class="btn btn-primary btn-large" onclick="WritingModule.finishSceneHologram()">完成作文 📖</button>
                </div>
            </div>
        `;
    },

    insertWord(sectionIndex, word, el) {
        Audio.playClick();
        const textarea = document.getElementById(`textarea-${sectionIndex}`);
        const cursorPos = textarea.selectionStart;
        const text = textarea.value;
        const newText = text.slice(0, cursorPos) + word + text.slice(cursorPos);
        textarea.value = newText;
        textarea.focus();
        textarea.setSelectionRange(cursorPos + word.length, cursorPos + word.length);
        el.classList.add('used');
    },

    finishSceneHologram() {
        const frame = this.currentFrame;
        let fullText = '';
        let totalWords = 0;

        for (let i = 0; i < frame.sections.length; i++) {
            const text = document.getElementById(`textarea-${i}`).value.trim();
            if (!text) {
                Effects.shake(document.getElementById(`textarea-${i}`));
                return;
            }
            fullText += text + '\n\n';
            totalWords += text.length;
        }

        let score = 70;
        score += Math.floor(totalWords / 20) * 5;
        score = Math.min(score, 80);

        Store.recordCompletion('writing', 'sceneHologram', 1, 1);
        Store.addScore(score);
        Scoring.checkAllBadges();

        Store.saveStory({
            title: frame.title,
            content: fullText.trim(),
            icon: '🎬',
            type: 'sceneHologram',
            wordCount: totalWords
        });

        document.getElementById('app').innerHTML = `
            <div class="question-area">
                <div class="card" style="background:linear-gradient(135deg,rgba(30,42,94,0.8),rgba(45,27,105,0.8));border-color:var(--color-star-yellow);">
                    <h3 style="font-family:var(--font-title);color:var(--color-star-yellow);text-align:center;margin-bottom:16px;">🎬 ${frame.title}</h3>
                    <div style="white-space:pre-wrap;line-height:1.8;font-size:1.05rem;">${fullText.trim()}</div>
                    <div style="text-align:center;margin-top:16px;">
                        <button class="btn btn-secondary" onclick="WritingModule.readStory('${fullText.replace(/'/g, "\\'").replace(/\n/g, '\\n').trim()}')">🔊 朗读</button>
                    </div>
                </div>
                <div class="result-container">
                    <div class="result-icon">🎉</div>
                    <h2 class="result-title">作文完成！</h2>
                    <div class="result-score">+${score}</div>
                    <div class="result-stats">
                        <div class="result-stat">
                            <div class="result-stat-value">${totalWords}</div>
                            <div class="result-stat-label">字数</div>
                        </div>
                    </div>
                    <div class="result-actions">
                        <button class="btn btn-secondary" onclick="App.navigate('writing')">返回作文星球</button>
                        <button class="btn btn-primary" onclick="WritingModule.startTask('sceneHologram')">再写一篇</button>
                    </div>
                </div>
            </div>
        `;

        Audio.playComplete();
        App.updateStatusbar();
    },

    // 查看历史故事
    viewStory(storyId) {
        const story = (Store.data.stories || []).find(s => s.id === storyId);
        if (!story) return;

        document.getElementById('app').innerHTML = `
            <div class="question-area">
                <div class="card" style="background:linear-gradient(135deg,rgba(30,42,94,0.8),rgba(45,27,105,0.8));border-color:var(--color-star-yellow);">
                    <div style="text-align:center;margin-bottom:16px;">
                        <div style="font-size:3rem;">${story.icon}</div>
                        <h3 style="font-family:var(--font-title);color:var(--color-star-yellow);margin-top:8px;">${story.title}</h3>
                        <div style="color:var(--color-text-secondary);font-size:0.85rem;">${story.date.slice(0,10)} · ${story.wordCount}字</div>
                    </div>
                    <div style="white-space:pre-wrap;line-height:1.8;font-size:1.05rem;">${story.content}</div>
                    <div style="text-align:center;margin-top:16px;">
                        <button class="btn btn-secondary" onclick="WritingModule.readStory('${story.content.replace(/'/g, "\\'").replace(/\n/g, '\\n')}')">🔊 朗读</button>
                    </div>
                </div>
                <div style="text-align:center;margin-top:20px;">
                    <button class="btn btn-secondary" onclick="App.navigate('writing')">返回作文星球</button>
                </div>
            </div>
        `;
    }
};

window.WritingModule = WritingModule;
