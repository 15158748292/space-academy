/**
 * 英语题库
 * 按题型和难度组织
 */

const EnglishQuestions = {
    // 题型一：单词星际航行（词汇匹配）
    vocabulary: [
        {
            id: 'voc_food',
            theme: '飞船补给站',
            story: '宇航员需要把太空食物正确分类入库，帮帮忙！',
            difficulty: 1,
            pairs: [
                { en: 'apple',  zh: '苹果' },
                { en: 'bread',  zh: '面包' },
                { en: 'water',  zh: '水' },
                { en: 'milk',   zh: '牛奶' },
                { en: 'egg',    zh: '鸡蛋' }
            ]
        },
        {
            id: 'voc_space',
            theme: '星际导航',
            story: '飞船导航系统需要校准太空词汇，帮宇航员匹配！',
            difficulty: 1,
            pairs: [
                { en: 'star',  zh: '星星' },
                { en: 'moon',  zh: '月亮' },
                { en: 'sun',   zh: '太阳' },
                { en: 'ship',  zh: '飞船' },
                { en: 'fly',   zh: '飞' }
            ]
        },
        {
            id: 'voc_color',
            theme: '星云色彩',
            story: '外星人想了解地球的颜色，帮它匹配！',
            difficulty: 2,
            pairs: [
                { en: 'red',    zh: '红色' },
                { en: 'blue',   zh: '蓝色' },
                { en: 'green',  zh: '绿色' },
                { en: 'yellow', zh: '黄色' },
                { en: 'white',  zh: '白色' },
                { en: 'black',  zh: '黑色' }
            ]
        },
        {
            id: 'voc_animal',
            theme: '太空动物园',
            story: '太空动物园的标签混乱了，帮动物找到正确的名字！',
            difficulty: 2,
            pairs: [
                { en: 'cat',   zh: '猫' },
                { en: 'dog',   zh: '狗' },
                { en: 'bird',  zh: '鸟' },
                { en: 'fish',  zh: '鱼' },
                { en: 'rabbit', zh: '兔子' },
                { en: 'horse',  zh: '马' }
            ]
        },
        {
            id: 'voc_number',
            theme: '星际密码',
            story: '太空基地的密码需要匹配数字，快帮忙！',
            difficulty: 1,
            pairs: [
                { en: 'one',   zh: '1' },
                { en: 'two',   zh: '2' },
                { en: 'three', zh: '3' },
                { en: 'four',  zh: '4' },
                { en: 'five',  zh: '5' }
            ]
        },
        {
            id: 'voc_body',
            theme: '宇航员装备',
            story: '宇航员需要检查身体部位对应的英文，帮它配对！',
            difficulty: 3,
            pairs: [
                { en: 'hand',  zh: '手' },
                { en: 'eye',   zh: '眼睛' },
                { en: 'ear',   zh: '耳朵' },
                { en: 'nose',  zh: '鼻子' },
                { en: 'mouth', zh: '嘴' },
                { en: 'head',  zh: '头' },
                { en: 'foot',  zh: '脚' }
            ]
        }
    ],

    // 题型二：句子修复站（句型排序/填空）
    sentence: [
        {
            id: 'sen_sort1',
            type: 'sort',
            story: '外星人的翻译器坏了，句子乱成一团，帮它修复！',
            difficulty: 2,
            words: ['She', 'is', 'reading', 'a book'],
            answer: ['She', 'is', 'reading', 'a book'],
            translation: '她正在读书。'
        },
        {
            id: 'sen_sort2',
            type: 'sort',
            story: '修复信号句子，让飞船能发出正确指令！',
            difficulty: 2,
            words: ['The', 'star', 'is', 'very', 'bright'],
            answer: ['The', 'star', 'is', 'very', 'bright'],
            translation: '那颗星星非常亮。'
        },
        {
            id: 'sen_sort3',
            type: 'sort',
            story: '修复通讯信号！',
            difficulty: 3,
            words: ['I', 'can', 'see', 'a', 'big', 'moon'],
            answer: ['I', 'can', 'see', 'a', 'big', 'moon'],
            translation: '我能看到一个大月亮。'
        },
        {
            id: 'sen_fill1',
            type: 'fill',
            story: '选一个正确的词填入信号中！',
            difficulty: 2,
            sentence: 'I can ___ a star in the sky.',
            options: ['see', 'eat', 'run'],
            answer: 'see',
            translation: '我能在天上看到一颗星星。'
        },
        {
            id: 'sen_fill2',
            type: 'fill',
            story: '修复飞船指令！',
            difficulty: 3,
            sentence: 'The astronaut ___ to the moon.',
            options: ['flies', 'flys', 'flying'],
            answer: 'flies',
            translation: '宇航员飞向月球。'
        },
        {
            id: 'sen_fill3',
            type: 'fill',
            story: '给外星人回复正确的信号！',
            difficulty: 2,
            sentence: 'The sun is ___ and hot.',
            options: ['bright', 'cold', 'small'],
            answer: 'bright',
            translation: '太阳很亮很热。'
        },
        {
            id: 'sen_sort4',
            type: 'sort',
            story: '翻译器又坏了，快来修复！',
            difficulty: 3,
            words: ['We', 'are', 'going', 'to', 'the', 'moon'],
            answer: ['We', 'are', 'going', 'to', 'the', 'moon'],
            translation: '我们要去月球。'
        }
    ],

    // 题型三：听力雷达站（听音选择）
    listening: [
        {
            id: 'lis_word1',
            story: '启动雷达，听一听是什么？',
            difficulty: 1,
            audio: 'cat',
            options: ['🐱 猫', '🐶 狗', '🐦 鸟'],
            answer: 0
        },
        {
            id: 'lis_word2',
            story: '雷达检测到声音，选出来！',
            difficulty: 1,
            audio: 'five',
            options: ['3', '5', '9'],
            answer: 1
        },
        {
            id: 'lis_word3',
            story: '听一听太空词汇！',
            difficulty: 1,
            audio: 'star',
            options: ['⭐ 星星', '🌙 月亮', '☀️ 太阳'],
            answer: 0
        },
        {
            id: 'lis_sent1',
            story: '雷达接收到一句话，选对的！',
            difficulty: 2,
            audio: 'The sun is hot.',
            options: ['太阳很热', '太阳很冷', '月亮很热'],
            answer: 0
        },
        {
            id: 'lis_sent2',
            story: '听外星人在说什么？',
            difficulty: 2,
            audio: 'I have a rocket.',
            options: ['我有一架火箭', '我有一架飞机', '我有一艘船'],
            answer: 0
        },
        {
            id: 'lis_word4',
            story: '雷达扫描中...',
            difficulty: 2,
            audio: 'moon',
            options: ['⭐ 星星', '🌙 月亮', '🌍 地球'],
            answer: 1
        },
        {
            id: 'lis_sent3',
            story: '最后一段信号！',
            difficulty: 3,
            audio: 'She can fly a spaceship.',
            options: ['她会开飞船', '她会开汽车', '她会骑自行车'],
            answer: 0
        }
    ],

    // 题型四：对话外星人（情景对话选择）
    dialogue: [
        {
            id: 'dia_greeting',
            story: '你遇到了一个外星人，它向你打招呼。',
            alien: 'Hello! What is your name?',
            alienTranslation: '你好！你叫什么名字？',
            options: [
                { text: 'My name is Tom.', correct: true, trans: '我叫Tom。' },
                { text: 'I am five years old.', correct: false, trans: '我五岁了。' },
                { text: 'Goodbye!', correct: false, trans: '再见！' }
            ]
        },
        {
            id: 'dia_thanks',
            story: '外星人给你一块太空饼干，你想表达感谢。',
            alien: 'Here is a space cookie for you!',
            alienTranslation: '这是给你的太空饼干！',
            options: [
                { text: 'I am happy.', correct: false, trans: '我很开心。' },
                { text: 'Thank you!', correct: true, trans: '谢谢你！' },
                { text: 'What is this?', correct: false, trans: '这是什么？' }
            ]
        },
        {
            id: 'dia_ability',
            story: '外星人问你会做什么。',
            alien: 'What can you do?',
            alienTranslation: '你会做什么？',
            options: [
                { text: 'I can fly a spaceship.', correct: true, trans: '我会开飞船。' },
                { text: 'I am a boy.', correct: false, trans: '我是男孩。' },
                { text: 'It is a star.', correct: false, trans: '它是一颗星星。' }
            ]
        },
        {
            id: 'dia_farewell',
            story: '外星人要离开了，你想和它说再见。',
            alien: 'I have to go now. See you next time!',
            alienTranslation: '我得走了。下次见！',
            options: [
                { text: 'What is your name?', correct: false, trans: '你叫什么？' },
                { text: 'Goodbye! See you!', correct: true, trans: '再见！回头见！' },
                { text: 'I am happy.', correct: false, trans: '我很开心。' }
            ]
        },
        {
            id: 'dia_like',
            story: '外星人问你喜欢什么。',
            alien: 'What do you like?',
            alienTranslation: '你喜欢什么？',
            options: [
                { text: 'I like stars.', correct: true, trans: '我喜欢星星。' },
                { text: 'I am ten.', correct: false, trans: '我十岁了。' },
                { text: 'It is hot.', correct: false, trans: '它很热。' }
            ]
        },
        {
            id: 'dia_weather',
            story: '外星人问地球上天气怎么样。',
            alien: 'How is the weather on Earth?',
            alienTranslation: '地球上的天气怎么样？',
            options: [
                { text: 'It is a star.', correct: false, trans: '它是一颗星星。' },
                { text: 'It is sunny today.', correct: true, trans: '今天晴天。' },
                { text: 'My name is Tom.', correct: false, trans: '我叫Tom。' }
            ]
        }
    ]
};

window.EnglishQuestions = EnglishQuestions;
