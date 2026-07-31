/**
 * MathModule - 数学星球
 * 四种题型：燃料计算器、星际航线、密码方程式、基地建造师
 */

const MathModule = {
    tasks: [
        { id: 'fuelCalc', icon: '⛽', title: '燃料计算器', desc: '计算燃料数量，让飞船起飞！', type: 'fuelCalc', minLevel: 1 },
        { id: 'starRoute', icon: '🛰️', title: '星际航线', desc: '用分数规划太空航线！', type: 'starRoute', minLevel: 1 },
        { id: 'cipherEq', icon: '🔐', title: '密码方程式', desc: '解方程破解密码锁！', type: 'cipherEq', minLevel: 1 },
        { id: 'baseBuild', icon: '🏗️', title: '基地建造师', desc: '计算面积建造太空基地！', type: 'baseBuild', minLevel: 1 }
    ],

    currentTask: null,
    currentQuestions: [],
    currentIndex: 0,
    correctCount: 0,
    answeredWrong: [],

    renderSubjectPage(container) {
        const progress = Store.data.progress.math;
        const levelInfo = Scoring.getLevelInfo();

        let tasksHtml = '';
        for (const task of this.tasks) {
            const locked = levelInfo.current.level < task.minLevel;
            const completed = progress[task.id].completed;
            tasksHtml += `
                <div class="task-card ${locked ? 'locked' : ''}" ${locked ? '' : `onclick="MathModule.startTask('${task.id}')"`}>
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
                    <h1 class="subject-title math">🔢 数学星球</h1>
                    <p class="subject-desc">用数学解决太空问题，每个数字都是一次冒险！</p>
                </div>
                <div class="task-grid">${tasksHtml}</div>
            </div>
        `;
    },

    startTask(taskId) {
        Audio.playClick();
        this.currentTask = this.tasks.find(t => t.id === taskId);
        const allQuestions = MathQuestions[taskId] || [];
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        this.currentQuestions = shuffled.slice(0, Math.min(6, shuffled.length));
        this.currentIndex = 0;
        this.correctCount = 0;
        this.answeredWrong = [];
        this.renderQuestion();
    },

    renderQuestion() {
        const app = document.getElementById('app');
        const q = this.currentQuestions[this.currentIndex];

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
            case 'fuelCalc':
                questionHtml = this.renderFuelCalc(q);
                break;
            case 'starRoute':
                questionHtml = this.renderStarRoute(q);
                break;
            case 'cipherEq':
                questionHtml = this.renderCipherEq(q);
                break;
            case 'baseBuild':
                questionHtml = this.renderBaseBuild(q);
                break;
        }

        app.innerHTML = header + questionHtml;
    },

    // 题型一：燃料计算器
    renderFuelCalc(q) {
        return `
            <div class="question-area">
                <div class="question-story">⛽ ${q.story}</div>
                <div class="question-text">${q.question}</div>
                <div style="text-align:center;margin:20px 0;">
                    <div style="font-family:var(--font-number);font-size:1.5rem;color:var(--color-star-yellow);">${q.expression}</div>
                    <div class="fuel-gauge" style="max-width:300px;margin:16px auto;">
                        <div class="fuel-bar" id="fuel-bar" style="width:0%"></div>
                    </div>
                </div>
                <div style="text-align:center;">
                    <input type="number" class="fill-input" id="fuel-answer" placeholder="输入答案" step="0.1" onkeydown="if(event.key==='Enter')MathModule.checkFuelCalc(${q.answer}, '${q.unit}')">
                    <span style="margin-left:8px;color:var(--color-text-secondary);">${q.unit}</span>
                </div>
                <div id="fuel-feedback"></div>
                <div style="text-align:center;margin-top:16px;">
                    <button class="btn btn-primary" onclick="MathModule.checkFuelCalc(${q.answer}, '${q.unit}')">确认 🚀</button>
                </div>
            </div>
        `;
    },

    checkFuelCalc(answer, unit) {
        const input = document.getElementById('fuel-answer');
        const userAnswer = parseFloat(input.value);
        const feedback = document.getElementById('fuel-feedback');

        if (isNaN(userAnswer)) {
            feedback.innerHTML = `<div class="feedback error">请输入数字哦！</div>`;
            return;
        }

        input.disabled = true;
        const isCorrect = Math.abs(userAnswer - answer) < 0.01;

        if (isCorrect) {
            input.classList.add('correct');
            feedback.innerHTML = `<div class="feedback success">✅ 燃料加满！飞船可以起飞了！</div>`;
            this.correctCount++;
            Audio.playCorrect();
            Effects.showEncourage(Effects.randomEncourage());

            // 燃料表动画
            document.getElementById('fuel-bar').style.width = '100%';
        } else {
            input.classList.add('wrong');
            feedback.innerHTML = `<div class="feedback error">正确答案：${answer} ${unit}</div>`;
            this.answeredWrong.push(this.currentIndex);
            Audio.playWrong();
        }

        setTimeout(() => this.nextQuestion(), 2000);
    },

    // 题型二：星际航线（选择题）
    renderStarRoute(q) {
        let optionsHtml = q.options.map((opt, i) =>
            `<button class="option-btn" onclick="MathModule.answerStarRoute(${i}, ${q.correctIndex})">
                <span class="option-letter">${'ABC'[i]}</span>${opt}
            </button>`
        ).join('');

        return `
            <div class="question-area">
                <div class="question-story">🛰️ ${q.story}</div>
                <div class="question-text">${q.question}</div>
                <div class="options">${optionsHtml}</div>
                <div id="star-feedback"></div>
            </div>
        `;
    },

    answerStarRoute(selected, correctIndex) {
        const isCorrect = selected === correctIndex;
        const buttons = document.querySelectorAll('.option-btn');
        const q = this.currentQuestions[this.currentIndex];

        buttons.forEach((btn, i) => {
            if (i === correctIndex) {
                btn.classList.add('correct');
            } else if (i === selected) {
                btn.classList.add('wrong');
            }
            btn.style.pointerEvents = 'none';
        });

        const feedback = document.getElementById('star-feedback');
        if (isCorrect) {
            feedback.innerHTML = `<div class="feedback success">✅ 航线连通！${q.answerDesc}</div>`;
            this.correctCount++;
            Audio.playCorrect();
            Effects.showEncourage(Effects.randomEncourage());
        } else {
            feedback.innerHTML = `<div class="feedback error">正确答案：${q.answer}<br>${q.answerDesc}</div>`;
            this.answeredWrong.push(this.currentIndex);
            Audio.playWrong();
        }

        setTimeout(() => this.nextQuestion(), 2200);
    },

    // 题型三：密码方程式
    renderCipherEq(q) {
        return `
            <div class="question-area">
                <div class="question-story">🔐 ${q.story}</div>
                <div class="question-text">${q.question}</div>
                <div class="cipher-lock" id="cipher-lock">🔒</div>
                <div style="text-align:center;margin:20px 0;">
                    <div style="font-family:var(--font-number);font-size:2rem;color:var(--color-star-yellow);background:rgba(255,217,61,0.1);padding:16px;border-radius:12px;border:2px solid rgba(255,217,61,0.3);">
                        ${q.equation}
                    </div>
                </div>
                <div style="text-align:center;">
                    <span style="color:var(--color-text-secondary);">x = </span>
                    <input type="number" class="fill-input" id="cipher-answer" placeholder="?" step="0.1" onkeydown="if(event.key==='Enter')MathModule.checkCipherEq(${q.answer})">
                </div>
                <div id="cipher-feedback"></div>
                <div style="text-align:center;margin-top:16px;">
                    <button class="btn btn-primary" onclick="MathModule.checkCipherEq(${q.answer})">解锁 🔓</button>
                </div>
            </div>
        `;
    },

    checkCipherEq(answer) {
        const input = document.getElementById('cipher-answer');
        const userAnswer = parseFloat(input.value);
        const feedback = document.getElementById('cipher-feedback');
        const lock = document.getElementById('cipher-lock');

        if (isNaN(userAnswer)) {
            feedback.innerHTML = `<div class="feedback error">请输入数字！</div>`;
            return;
        }

        input.disabled = true;
        const isCorrect = Math.abs(userAnswer - answer) < 0.01;

        if (isCorrect) {
            input.classList.add('correct');
            lock.textContent = '🔓';
            lock.classList.add('unlocked');
            feedback.innerHTML = `<div class="feedback success">✅ 密码正确！基地大门打开了！</div>`;
            this.correctCount++;
            Audio.playCorrect();
            Effects.showEncourage(Effects.randomEncourage());
        } else {
            input.classList.add('wrong');
            feedback.innerHTML = `<div class="feedback error">密码不对，正确答案是：x = ${answer}</div>`;
            this.answeredWrong.push(this.currentIndex);
            Audio.playWrong();
        }

        setTimeout(() => this.nextQuestion(), 2200);
    },

    // 题型四：基地建造师
    renderBaseBuild(q) {
        const shapes = {
            '长方形': '▭', '正方形': '◻', '平行四边形': '▱',
            '三角形': '△', '梯形': '⏢'
        };
        const shapeIcon = shapes[q.shape] || '⬜';

        return `
            <div class="question-area">
                <div class="question-story">🏗️ ${q.story}</div>
                <div class="question-text">${q.question}</div>
                <div style="text-align:center;margin:16px 0;">
                    <div style="font-size:4rem;">${shapeIcon}</div>
                    <div style="color:var(--color-text-secondary);margin-top:8px;">形状：${q.shape} | ${q.params}</div>
                    <div style="font-family:var(--font-number);font-size:1.3rem;color:var(--color-star-yellow);margin-top:12px;">${q.expression}</div>
                </div>
                <div style="text-align:center;">
                    <input type="number" class="fill-input" id="build-answer" placeholder="面积" step="0.1" onkeydown="if(event.key==='Enter')MathModule.checkBaseBuild(${q.answer}, '${q.unit}')">
                    <span style="margin-left:8px;color:var(--color-text-secondary);">${q.unit}</span>
                </div>
                <div id="build-feedback"></div>
                <div style="text-align:center;margin-top:16px;">
                    <button class="btn btn-primary" onclick="MathModule.checkBaseBuild(${q.answer}, '${q.unit}')">建造 🏗️</button>
                </div>
            </div>
        `;
    },

    checkBaseBuild(answer, unit) {
        const input = document.getElementById('build-answer');
        const userAnswer = parseFloat(input.value);
        const feedback = document.getElementById('build-feedback');

        if (isNaN(userAnswer)) {
            feedback.innerHTML = `<div class="feedback error">请输入数字！</div>`;
            return;
        }

        input.disabled = true;
        const isCorrect = Math.abs(userAnswer - answer) < 0.5;

        if (isCorrect) {
            input.classList.add('correct');
            feedback.innerHTML = `<div class="feedback success">✅ 建造完成！基地又多了一座建筑！</div>`;
            this.correctCount++;
            Audio.playCorrect();
            Effects.showEncourage(Effects.randomEncourage());
        } else {
            input.classList.add('wrong');
            feedback.innerHTML = `<div class="feedback error">建造失败，正确面积是：${answer} ${unit}</div>`;
            this.answeredWrong.push(this.currentIndex);
            Audio.playWrong();
        }

        setTimeout(() => this.nextQuestion(), 2200);
    },

    nextQuestion() {
        this.currentIndex++;
        if (this.currentIndex < this.currentQuestions.length) {
            this.renderQuestion();
        } else {
            this.finishTask();
        }
    },

    finishTask() {
        const total = this.currentQuestions.length;
        const correct = this.correctCount;
        const score = Scoring.calculateScore('math', this.currentTask.id, correct, total);

        Store.recordCompletion('math', this.currentTask.id, correct, total);
        Store.addScore(score);
        Scoring.checkAllBadges();

        const ratio = Math.round(correct / total * 100);
        let icon = ratio >= 80 ? '🌟' : ratio >= 60 ? '👍' : '💪';
        let title = ratio >= 80 ? '完美航行！' : ratio >= 60 ? '任务完成！' : '继续加油！';

        document.getElementById('app').innerHTML = `
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
                    <button class="btn btn-secondary" onclick="App.navigate('math')">返回数学星球</button>
                    <button class="btn btn-primary" onclick="MathModule.startTask('${this.currentTask.id}')">再来一次</button>
                </div>
            </div>
        `;

        Audio.playComplete();
        App.updateStatusbar();
    }
};

window.MathModule = MathModule;
