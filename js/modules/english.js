/**
 * EnglishModule - 英语星球
 * 四种题型：单词星际航行、句子修复站、听力雷达站、对话外星人
 */

const EnglishModule = {
    tasks: [
        { id: 'vocabulary', icon: '🔗', title: '单词星际航行', desc: '匹配英文和中文，帮飞船补给！', type: 'vocabulary', minLevel: 1 },
        { id: 'sentence',   icon: '🔧', title: '句子修复站',   desc: '修复乱序句子，让飞船通讯恢复！', type: 'sentence', minLevel: 1 },
        { id: 'listening',  icon: '📡', title: '听力雷达站',   desc: '听声音选答案，扫描太空信号！', type: 'listening', minLevel: 2 },
        { id: 'dialogue',   icon: '👽', title: '对话外星人',   desc: '和外星人用英语交流，建立友谊！', type: 'dialogue', minLevel: 1 }
    ],

    currentTask: null,
    currentQuestions: [],
    currentIndex: 0,
    correctCount: 0,
    answeredWrong: [],

    renderSubjectPage(container) {
        const progress = Store.data.progress.english;
        const levelInfo = Scoring.getLevelInfo();

        let tasksHtml = '';
        for (const task of this.tasks) {
            const locked = levelInfo.current.level < task.minLevel;
            const completed = progress[task.id].completed;
            tasksHtml += `
                <div class="task-card ${locked ? 'locked' : ''}" ${locked ? '' : `onclick="EnglishModule.startTask('${task.id}')"`}>
                    <div class="task-card-icon">${task.icon}</div>
                    <div class="task-card-title">${task.title}</div>
                    <div class="task-card-desc">${task.desc}</div>
                    ${completed > 0 ? `<div class="task-card-badge">已完成 ${completed} 次</div>` : ''}
                    ${locked ? `<div class="task-card-lock">🔒</div>` : ''}
                </div>
            `;
        }

        container.innerHTML = `
            <div class="subject-page">
                <div class="subject-header">
                    <h1 class="subject-title english">📚 英语星球</h1>
                    <p class="subject-desc">在星际任务中学习英语，每个任务都是一次冒险！</p>
                </div>
                <div class="task-grid">${tasksHtml}</div>
            </div>
        `;
    },

    // 开始任务
    startTask(taskId) {
        Audio.playClick();
        const task = this.tasks.find(t => t.id === taskId);
        this.currentTask = task;

        // 从题库随机选取6-8题
        const allQuestions = EnglishQuestions[taskId] || [];
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        this.currentQuestions = shuffled.slice(0, Math.min(6, shuffled.length));
        this.currentIndex = 0;
        this.correctCount = 0;
        this.answeredWrong = [];

        this.renderQuestion();
    },

    // 渲染题目
    renderQuestion() {
        const app = document.getElementById('app');
        const q = this.currentQuestions[this.currentIndex];

        // 进度点
        let dotsHtml = '';
        for (let i = 0; i < this.currentQuestions.length; i++) {
            let cls = 'progress-dot';
            if (i < this.currentIndex) cls += this.answeredWrong.includes(i) ? ' wrong' : ' done';
            if (i === this.currentIndex) cls += ' current';
            dotsHtml += `<div class="${cls}"></div>`;
        }

        const header = `
            <div class="quiz-progress">
                <span>任务进度</span>
                <div class="progress-dots">${dotsHtml}</div>
                <span>${this.currentIndex + 1}/${this.currentQuestions.length}</span>
            </div>
        `;

        let questionHtml = '';
        switch (this.currentTask.type) {
            case 'vocabulary':
                questionHtml = this.renderVocabulary(q);
                break;
            case 'sentence':
                questionHtml = this.renderSentence(q);
                break;
            case 'listening':
                questionHtml = this.renderListening(q);
                break;
            case 'dialogue':
                questionHtml = this.renderDialogue(q);
                break;
        }

        app.innerHTML = header + questionHtml;
    },

    // 题型一：单词星际航行（连线匹配）
    renderVocabulary(q) {
        const shuffled = [...q.pairs].sort(() => Math.random() - 0.5);
        const shuffledZh = [...q.pairs].map(p => p.zh).sort(() => Math.random() - 0.5);

        let leftHtml = shuffled.map((p, i) =>
            `<div class="match-item" data-en="${p.en}" data-index="${i}" onclick="EnglishModule.selectMatch('left', ${i}, '${p.en}')">${p.en}</div>`
        ).join('');

        let rightHtml = shuffledZh.map((zh, i) => {
            const pair = q.pairs.find(p => p.zh === zh);
            return `<div class="match-item" data-zh="${zh}" data-index="${i}" data-en="${pair.en}" onclick="EnglishModule.selectMatch('right', ${i}, '${pair.en}')">${zh}</div>`;
        }).join('');

        return `
            <div class="question-area">
                <div class="question-story">📡 ${q.story}</div>
                <div class="question-text">主题：${q.theme} — 点击左右配对！</div>
                <div class="match-container">
                    <div class="match-column" id="match-left">${leftHtml}</div>
                    <div class="match-column" id="match-right">${rightHtml}</div>
                </div>
                <div id="match-feedback"></div>
            </div>
            <div id="match-complete" class="hidden">
                <div class="result-container">
                    <div class="result-icon">🎉</div>
                    <h2 class="result-title">任务完成！</h2>
                    <div id="match-result-content"></div>
                </div>
            </div>
        `;
    },

    selectedLeft: null,
    selectedRight: null,
    matchedPairs: 0,

    selectMatch(side, index, value) {
        Audio.playClick();
        const items = document.querySelectorAll(`#match-${side} .match-item`);

        if (side === 'left') {
            document.querySelectorAll('#match-left .match-item').forEach(el => el.classList.remove('selected'));
            items[index].classList.add('selected');
            this.selectedLeft = { index, value, el: items[index] };
        } else {
            document.querySelectorAll('#match-right .match-item').forEach(el => el.classList.remove('selected'));
            items[index].classList.add('selected');
            this.selectedRight = { index, value, el: items[index] };
        }

        // 两边都选了，检查匹配
        if (this.selectedLeft && this.selectedRight) {
            const isCorrect = this.selectedLeft.value === this.selectedRight.value;
            const leftEl = this.selectedLeft.el;
            const rightEl = this.selectedRight.el;

            if (isCorrect) {
                leftEl.classList.add('matched');
                rightEl.classList.add('matched');
                leftEl.classList.remove('selected');
                rightEl.classList.remove('selected');
                this.matchedPairs++;
                this.correctCount++;

                Audio.playCorrect();
                Effects.showEncourage(Effects.randomEncourage());

                // 检查是否全部匹配
                const totalPairs = this.currentQuestions[this.currentIndex].pairs.length;
                if (this.matchedPairs >= totalPairs) {
                    this.finishVocabularyQuestion();
                }
            } else {
                leftEl.classList.add('wrong-flash');
                rightEl.classList.add('wrong-flash');
                Audio.playWrong();
                Effects.showEncourage(Effects.randomRetry());

                setTimeout(() => {
                    leftEl.classList.remove('wrong-flash', 'selected');
                    rightEl.classList.remove('wrong-flash', 'selected');
                }, 600);
            }

            this.selectedLeft = null;
            this.selectedRight = null;
        }
    },

    finishVocabularyQuestion() {
        this.matchedPairs = 0;
        this.nextQuestion();
    },

    // 题型二：句子修复站
    renderSentence(q) {
        if (q.type === 'sort') {
            const shuffled = [...q.words].sort(() => Math.random() - 0.5);
            let wordsHtml = shuffled.map((w, i) =>
                `<span class="word-card" onclick="EnglishModule.placeWord(${i}, '${w.replace(/'/g, "\\'")}')">${w}</span>`
            ).join('');

            return `
                <div class="question-area">
                    <div class="question-story">🔧 ${q.story}</div>
                    <div class="question-text">把单词排成正确的句子：<br><small style="color:var(--color-text-secondary);">${q.translation}</small></div>
                    <div class="sentence-slots" id="sentence-slots"></div>
                    <div style="margin-top:10px;">${wordsHtml}</div>
                    <div id="sentence-feedback"></div>
                </div>
            `;
        } else {
            let optionsHtml = q.options.map((opt, i) =>
                `<button class="option-btn" onclick="EnglishModule.answerFill('${opt.replace(/'/g, "\\'")}', '${q.answer.replace(/'/g, "\\'")}')">
                    <span class="option-letter">${'ABC'[i]}</span>${opt}
                </button>`
            ).join('');

            return `
                <div class="question-area">
                    <div class="question-story">🔧 ${q.story}</div>
                    <div class="question-text">${q.sentence}</div>
                    <div class="options">${optionsHtml}</div>
                    <div id="fill-feedback"></div>
                </div>
            `;
        }
    },

    placedWords: [],

    placeWord(index, word) {
        Audio.playClick();
        const slots = document.getElementById('sentence-slots');
        const cards = document.querySelectorAll('.word-card');

        // 如果已经放置，跳过
        if (this.placedWords.includes(index)) return;

        this.placedWords.push(index);
        cards[index].classList.add('placed');

        const slot = document.createElement('span');
        slot.className = 'word-card placed';
        slot.textContent = word;
        slot.dataset.wordIndex = index;
        slot.onclick = () => this.removeWord(index, word, slot);
        slots.appendChild(slot);

        // 检查是否全部放置
        const q = this.currentQuestions[this.currentIndex];
        if (this.placedWords.length >= q.words.length) {
            // 检查顺序
            const placed = Array.from(slots.children).map(el => el.textContent);
            const isCorrect = JSON.stringify(placed) === JSON.stringify(q.answer);

            const feedback = document.getElementById('sentence-feedback');
            if (isCorrect) {
                feedback.innerHTML = `<div class="feedback success">✅ ${q.translation} ${Effects.randomEncourage()}</div>`;
                this.correctCount++;
                Audio.playCorrect();
                Effects.showEncourage(Effects.randomEncourage());
                setTimeout(() => this.nextQuestion(), 1500);
            } else {
                feedback.innerHTML = `<div class="feedback error">顺序不对，再试试！正确顺序：${q.answer.join(' ')}</div>`;
                this.answeredWrong.push(this.currentIndex);
                Audio.playWrong();
                setTimeout(() => this.nextQuestion(), 2000);
            }
        }
    },

    removeWord(index, word, slotEl) {
        Audio.playClick();
        this.placedWords = this.placedWords.filter(i => i !== index);
        slotEl.remove();
        const cards = document.querySelectorAll('.word-card');
        cards[index]?.classList.remove('placed');
    },

    answerFill(selected, answer) {
        const buttons = document.querySelectorAll('.option-btn');
        const isCorrect = selected === answer;
        const q = this.currentQuestions[this.currentIndex];

        buttons.forEach(btn => {
            const text = btn.textContent.trim().slice(1).trim();
            if (text === answer) {
                btn.classList.add('correct');
            } else if (text === selected) {
                btn.classList.add(isCorrect ? 'correct' : 'wrong');
            }
            btn.style.pointerEvents = 'none';
        });

        const feedback = document.getElementById('fill-feedback');
        if (isCorrect) {
            feedback.innerHTML = `<div class="feedback success">✅ ${q.translation} ${Effects.randomEncourage()}</div>`;
            this.correctCount++;
            Audio.playCorrect();
            Effects.showEncourage(Effects.randomEncourage());
        } else {
            feedback.innerHTML = `<div class="feedback error">正确答案是：${answer}<br>${q.translation}</div>`;
            this.answeredWrong.push(this.currentIndex);
            Audio.playWrong();
        }

        setTimeout(() => this.nextQuestion(), 2000);
    },

    // 题型三：听力雷达站
    renderListening(q) {
        let optionsHtml = q.options.map((opt, i) =>
            `<button class="option-btn" onclick="EnglishModule.answerListening(${i}, ${q.answer})">
                <span class="option-letter">${'ABC'[i]}</span>${opt}
            </button>`
        ).join('');

        return `
            <div class="question-area">
                <div class="question-story">📡 ${q.story}</div>
                <div style="text-align:center;margin:20px 0;">
                    <button class="btn btn-primary btn-large" onclick="EnglishModule.playAudio('${q.audio.replace(/'/g, "\\'")}')">
                        🔊 播放声音
                    </button>
                </div>
                <div class="options">${optionsHtml}</div>
                <div id="listening-feedback"></div>
            </div>
        `;
    },

    playAudio(text) {
        Audio.playClick();
        Audio.speak(text);
    },

    answerListening(selected, answer) {
        const isCorrect = selected === answer;
        const buttons = document.querySelectorAll('.option-btn');

        buttons.forEach((btn, i) => {
            if (i === answer) {
                btn.classList.add('correct');
            } else if (i === selected && !isCorrect) {
                btn.classList.add('wrong');
            }
            btn.style.pointerEvents = 'none';
        });

        const feedback = document.getElementById('listening-feedback');
        const q = this.currentQuestions[this.currentIndex];
        if (isCorrect) {
            feedback.innerHTML = `<div class="feedback success">✅ ${Effects.randomEncourage()}</div>`;
            this.correctCount++;
            Audio.playCorrect();
            Effects.showEncourage(Effects.randomEncourage());
        } else {
            feedback.innerHTML = `<div class="feedback error">正确答案：${q.options[answer]}</div>`;
            this.answeredWrong.push(this.currentIndex);
            Audio.playWrong();
        }

        setTimeout(() => this.nextQuestion(), 2000);
    },

    // 题型四：对话外星人
    renderDialogue(q) {
        let optionsHtml = q.options.map((opt, i) =>
            `<button class="option-btn" onclick="EnglishModule.answerDialogue(${i})">
                <span class="option-letter">${'ABC'[i]}</span>
                <div><div>${opt.text}</div><small style="color:var(--color-text-secondary);">${opt.trans}</small></div>
            </button>`
        ).join('');

        return `
            <div class="question-area">
                <div class="question-story">👽 ${q.story}</div>
                <div class="card" style="background:rgba(255,217,61,0.1);border-color:rgba(255,217,61,0.3);margin-bottom:16px;">
                    <div style="font-size:1.2rem;margin-bottom:6px;">👽 "${q.alien}"</div>
                    <div style="color:var(--color-text-secondary);font-size:0.9rem;">${q.alienTranslation}</div>
                </div>
                <div style="color:var(--color-text-secondary);margin-bottom:12px;">选择最合适的回应：</div>
                <div class="options">${optionsHtml}</div>
                <div id="dialogue-feedback"></div>
            </div>
        `;
    },

    answerDialogue(selected) {
        const q = this.currentQuestions[this.currentIndex];
        const isCorrect = q.options[selected].correct;
        const buttons = document.querySelectorAll('.option-btn');

        buttons.forEach((btn, i) => {
            if (q.options[i].correct) {
                btn.classList.add('correct');
            } else if (i === selected) {
                btn.classList.add('wrong');
            }
            btn.style.pointerEvents = 'none';
        });

        const feedback = document.getElementById('dialogue-feedback');
        if (isCorrect) {
            feedback.innerHTML = `<div class="feedback success">✅ 太棒了！和外星人建立了友谊！</div>`;
            this.correctCount++;
            Audio.playCorrect();
            Effects.showEncourage(Effects.randomEncourage());

            // 如果是情景对话，播放正确回应的语音
            Audio.speak(q.options[selected].text);
        } else {
            const correctOpt = q.options.find(o => o.correct);
            feedback.innerHTML = `<div class="feedback error">更合适的回应是：${correctOpt.text}<br>${correctOpt.trans}</div>`;
            this.answeredWrong.push(this.currentIndex);
            Audio.playWrong();
        }

        setTimeout(() => this.nextQuestion(), 2500);
    },

    // 下一题
    nextQuestion() {
        this.currentIndex++;
        this.placedWords = [];

        if (this.currentIndex < this.currentQuestions.length) {
            this.renderQuestion();
        } else {
            this.finishTask();
        }
    },

    // 完成任务
    finishTask() {
        const total = this.currentQuestions.length;
        const correct = this.correctCount;
        const score = Scoring.calculateScore('english', this.currentTask.id, correct, total);

        Store.recordCompletion('english', this.currentTask.id, correct, total);
        const result = Store.addScore(score);
        Scoring.checkAllBadges();

        const ratio = Math.round(correct / total * 100);
        let icon = ratio >= 80 ? '🌟' : ratio >= 60 ? '👍' : '💪';
        let title = ratio >= 80 ? '完美航行！' : ratio >= 60 ? '任务完成！' : '继续加油！';

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="result-container">
                <div class="result-icon">${icon}</div>
                <h2 class="result-title">${title}</h2>
                <div class="result-score">+${score}</div>
                <div class="result-stats">
                    <div class="result-stat">
                        <div class="result-stat-value">${correct}/${total}</div>
                        <div class="result-stat-label">正确题数</div>
                    </div>
                    <div class="result-stat">
                        <div class="result-stat-value">${ratio}%</div>
                        <div class="result-stat-label">正确率</div>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-secondary" onclick="App.navigate('english')">返回英语星球</button>
                    <button class="btn btn-primary" onclick="EnglishModule.startTask('${this.currentTask.id}')">再来一次</button>
                </div>
            </div>
        `;

        Audio.playComplete();
        App.updateStatusbar();
    }
};

window.EnglishModule = EnglishModule;
