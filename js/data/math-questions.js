/**
 * 数学题库
 * 按题型组织，每道题包装成太空任务
 */

const MathQuestions = {
    // 题型一：燃料计算器（小数加减法）
    fuelCalc: [
        {
            id: 'fc1',
            story: '飞船目前有 12.5 升燃料，需要加到 20 升才能起飞。',
            question: '还需要加多少升燃料？',
            answer: 7.5,
            unit: '升',
            expression: '20 - 12.5 = ?',
            difficulty: 1
        },
        {
            id: 'fc2',
            story: '太空站A有 3.6 吨补给，太空站B有 5.8 吨补给。',
            question: '两个太空站一共有多少吨补给？',
            answer: 9.4,
            unit: '吨',
            expression: '3.6 + 5.8 = ?',
            difficulty: 2
        },
        {
            id: 'fc3',
            story: '火箭燃料箱容量 50 升，已用去 23.7 升。',
            question: '还剩多少升燃料？',
            answer: 26.3,
            unit: '升',
            expression: '50 - 23.7 = ?',
            difficulty: 2
        },
        {
            id: 'fc4',
            story: '月球基地有 15.4 升水，又运来 8.6 升。',
            question: '现在一共有多少升水？',
            answer: 24,
            unit: '升',
            expression: '15.4 + 8.6 = ?',
            difficulty: 2
        },
        {
            id: 'fc5',
            story: '宇航员体重 45.5 千克，穿了 6.8 千克的宇航服。',
            question: '总重量是多少千克？',
            answer: 52.3,
            unit: '千克',
            expression: '45.5 + 6.8 = ?',
            difficulty: 2
        },
        {
            id: 'fc6',
            story: '飞船速度是每秒 8.5 千米，飞行了 4 秒后减速了 2.3 千米/秒。',
            question: '现在速度是每秒多少千米？',
            answer: 6.2,
            unit: '千米/秒',
            expression: '8.5 - 2.3 = ?',
            difficulty: 1
        },
        {
            id: 'fc7',
            story: '太空温室收获了 12.8 千克西红柿和 7.5 千克黄瓜。',
            question: '一共收获了多少千克蔬菜？',
            answer: 20.3,
            unit: '千克',
            expression: '12.8 + 7.5 = ?',
            difficulty: 2
        },
        {
            id: 'fc8',
            story: '太空站需要 100 升燃料，已有 47.6 升。',
            question: '还差多少升？',
            answer: 52.4,
            unit: '升',
            expression: '100 - 47.6 = ?',
            difficulty: 3
        }
    ],

    // 题型二：星际航线（分数）
    starRoute: [
        {
            id: 'sr1',
            story: '从地球到月球需要 2/3 箱燃料，从月球到火星需要 1/3 箱燃料。',
            question: '一共需要多少箱燃料？',
            answer: '1',
            answerDesc: '2/3 + 1/3 = 3/3 = 1箱',
            options: ['1/3箱', '1箱', '2/3箱'],
            correctIndex: 1,
            difficulty: 1
        },
        {
            id: 'sr2',
            story: '太空蛋糕切成8块，宇航员吃了3块，外星朋友吃了2块。',
            question: '他们一共吃了这块蛋糕的几分之几？',
            answer: '5/8',
            answerDesc: '3/8 + 2/8 = 5/8',
            options: ['5/8', '3/8', '1/8'],
            correctIndex: 0,
            difficulty: 2
        },
        {
            id: 'sr3',
            story: '太空蛋糕切成8块，宇航员吃了3块，外星朋友吃了2块。',
            question: '还剩几分之几？',
            answer: '3/8',
            answerDesc: '8/8 - 5/8 = 3/8',
            options: ['5/8', '3/8', '2/8'],
            correctIndex: 1,
            difficulty: 2
        },
        {
            id: 'sr4',
            story: '三艘飞船执行任务，甲完成 1/4 航程，乙完成 2/4 航程，丙完成 1/4 航程。',
            question: '哪艘飞船走得最远？',
            answer: '乙飞船',
            answerDesc: '2/4 > 1/4，所以乙最远',
            options: ['甲飞船', '乙飞船', '丙飞船'],
            correctIndex: 1,
            difficulty: 1
        },
        {
            id: 'sr5',
            story: '三艘飞船执行任务，甲完成 1/4 航程，乙完成 2/4 航程，丙完成 1/4 航程。',
            question: '三艘一共完成了几分之几？',
            answer: '1',
            answerDesc: '1/4 + 2/4 + 1/4 = 4/4 = 1',
            options: ['3/4', '1', '2/4'],
            correctIndex: 1,
            difficulty: 2
        },
        {
            id: 'sr6',
            story: '火箭燃料箱装了 3/5 的燃料，又加了 1/5。',
            question: '现在燃料箱有几分之几的燃料？',
            answer: '4/5',
            answerDesc: '3/5 + 1/5 = 4/5',
            options: ['4/5', '3/5', '2/5'],
            correctIndex: 0,
            difficulty: 1
        },
        {
            id: 'sr7',
            story: '太空农场种了 5/8 的地是蔬菜，2/8 的地是水果。',
            question: '蔬菜比水果多几分之几？',
            answer: '3/8',
            answerDesc: '5/8 - 2/8 = 3/8',
            options: ['3/8', '7/8', '2/8'],
            correctIndex: 0,
            difficulty: 2
        },
        {
            id: 'sr8',
            story: '太空站完成任务需要 1 整箱能量，已充了 3/7 箱。',
            question: '还需要充几分之几箱？',
            answer: '4/7',
            answerDesc: '7/7 - 3/7 = 4/7',
            options: ['4/7', '3/7', '10/7'],
            correctIndex: 0,
            difficulty: 2
        }
    ],

    // 题型三：密码方程式（简易方程）
    cipherEq: [
        {
            id: 'ce1',
            story: '基地密码锁显示方程，破解它才能打开门！',
            equation: 'x + 15 = 32',
            question: 'x 等于多少才能解锁？',
            answer: 17,
            difficulty: 1
        },
        {
            id: 'ce2',
            story: '太空舱温度调节器需要输入密码！',
            equation: 'x - 8 = 20',
            question: 'x 等于多少？',
            answer: 28,
            difficulty: 1
        },
        {
            id: 'ce3',
            story: '氧气分配系统需要解出未知数！',
            equation: '3x = 27',
            question: 'x 等于多少？',
            answer: 9,
            difficulty: 2
        },
        {
            id: 'ce4',
            story: '火箭推进力计算器需要密码！',
            equation: '2x + 5 = 17',
            question: 'x 等于多少？',
            answer: 6,
            difficulty: 3
        },
        {
            id: 'ce5',
            story: '太空舱温度调节器(注意是小数哦)！',
            equation: 'x - 8.5 = 10',
            question: 'x 等于多少？',
            answer: 18.5,
            difficulty: 2
        },
        {
            id: 'ce6',
            story: '导航系统需要输入正确数值！',
            equation: 'x + 23 = 50',
            question: 'x 等于多少？',
            answer: 27,
            difficulty: 1
        },
        {
            id: 'ce7',
            story: '能源核心需要密码激活！',
            equation: '4x = 36',
            question: 'x 等于多少？',
            answer: 9,
            difficulty: 2
        },
        {
            id: 'ce8',
            story: '最后的密码锁！',
            equation: '3x - 6 = 15',
            question: 'x 等于多少？',
            answer: 7,
            difficulty: 3
        }
    ],

    // 题型四：基地建造师（多边形面积）
    baseBuild: [
        {
            id: 'bb1',
            story: '建造一个长方形太空温室。',
            shape: '长方形',
            params: '长 8 米，宽 5 米',
            question: '温室的面积是多少平方米？',
            answer: 40,
            unit: '平方米',
            expression: '8 × 5 = ?',
            difficulty: 1
        },
        {
            id: 'bb2',
            story: '建造一个正方形太空仓库。',
            shape: '正方形',
            params: '边长 6 米',
            question: '仓库的面积是多少平方米？',
            answer: 36,
            unit: '平方米',
            expression: '6 × 6 = ?',
            difficulty: 1
        },
        {
            id: 'bb3',
            story: '建造一个平行四边形太阳能板。',
            shape: '平行四边形',
            params: '底 6 米，高 4 米',
            question: '太阳能板的面积是多少？',
            answer: 24,
            unit: '平方米',
            expression: '6 × 4 = ?',
            difficulty: 2
        },
        {
            id: 'bb4',
            story: '建造一个三角形信号塔区域。',
            shape: '三角形',
            params: '底 10 米，高 6 米',
            question: '这个区域的面积是多少？',
            answer: 30,
            unit: '平方米',
            expression: '10 × 6 ÷ 2 = ?',
            difficulty: 2
        },
        {
            id: 'bb5',
            story: '太空基地需要建一个梯形停机坪。',
            shape: '梯形',
            params: '上底 4 米，下底 8 米，高 5 米',
            question: '停机坪的面积是多少？',
            answer: 30,
            unit: '平方米',
            expression: '(4 + 8) × 5 ÷ 2 = ?',
            difficulty: 3
        },
        {
            id: 'bb6',
            story: '建造一个长方形太空花园。',
            shape: '长方形',
            params: '长 12 米，宽 7 米',
            question: '花园的面积是多少平方米？',
            answer: 84,
            unit: '平方米',
            expression: '12 × 7 = ?',
            difficulty: 1
        },
        {
            id: 'bb7',
            story: '建造一个三角形太空雷达区域。',
            shape: '三角形',
            params: '底 8 米，高 5 米',
            question: '这个区域的面积是多少？',
            answer: 20,
            unit: '平方米',
            expression: '8 × 5 ÷ 2 = ?',
            difficulty: 2
        },
        {
            id: 'bb8',
            story: '建造一个平行四边形能量场。',
            shape: '平行四边形',
            params: '底 10 米，高 7 米',
            question: '能量场的面积是多少？',
            answer: 70,
            unit: '平方米',
            expression: '10 × 7 = ?',
            difficulty: 2
        }
    ]
};

window.MathQuestions = MathQuestions;
