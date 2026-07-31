/**
 * Audio - 语音合成与音效管理
 */

const Audio = {
    speechSupported: 'speechSynthesis' in window,
    audioContext: null,

    // 初始化音频上下文（需用户交互后调用）
    init() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('音频不支持');
            }
        }
    },

    // 语音合成
    speak(text, lang = 'en-US') {
        if (!this.speechSupported || !Store.data.settings.soundEnabled) return;

        // 取消之前的语音
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.85;  // 稍慢，适合小学生
        utterance.pitch = 1.1;  // 略高音调，更友好

        // 尝试使用对应语言的语音
        const voices = speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang === lang || v.lang.startsWith(lang.split('-')[0]));
        if (voice) utterance.voice = voice;

        speechSynthesis.speak(utterance);
    },

    // 中文朗读
    speakChinese(text) {
        this.speak(text, 'zh-CN');
    },

    // 音效：答对
    playCorrect() {
        if (!Store.data.settings.soundEnabled) return;
        this.playTone(523, 0.1, 'sine'); // C5
        setTimeout(() => this.playTone(659, 0.1, 'sine'), 100); // E5
        setTimeout(() => this.playTone(784, 0.15, 'sine'), 200); // G5
    },

    // 音效：答错
    playWrong() {
        if (!Store.data.settings.soundEnabled) return;
        this.playTone(200, 0.2, 'sawtooth', 0.1);
    },

    // 音效：点击
    playClick() {
        if (!Store.data.settings.soundEnabled) return;
        this.playTone(800, 0.05, 'square', 0.05);
    },

    // 音效：升级
    playLevelUp() {
        if (!Store.data.settings.soundEnabled) return;
        const notes = [523, 659, 784, 1047]; // C E G C
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.15), i * 100);
        });
    },

    // 音效：获得勋章
    playBadge() {
        if (!Store.data.settings.soundEnabled) return;
        const notes = [659, 784, 988, 1319]; // E5 G5 B5 E6
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.15, 'triangle', 0.12), i * 80);
        });
    },

    // 音效：完成任务
    playComplete() {
        if (!Store.data.settings.soundEnabled) return;
        this.playTone(523, 0.1, 'sine');
        setTimeout(() => this.playTone(659, 0.1, 'sine'), 100);
        setTimeout(() => this.playTone(784, 0.1, 'sine'), 200);
        setTimeout(() => this.playTone(1047, 0.3, 'sine'), 300);
    },

    // 播放音调
    playTone(frequency, duration, type = 'sine', volume = 0.1) {
        if (!this.audioContext) this.init();
        if (!this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = type;
            oscillator.frequency.value = frequency;

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            // 静默失败
        }
    },

    // 预加载语音列表（某些浏览器需要）
    loadVoices() {
        if (this.speechSupported) {
            speechSynthesis.getVoices();
        }
    }
};

// 某些浏览器需要异步加载语音
if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = () => Audio.loadVoices();
}

window.Audio = Audio;
