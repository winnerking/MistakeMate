/**
 * 模拟数据 - 用于在开发环境展示示例错题
 */

// 模拟图片数据（base64编码的简单图像）
const mockQuestionImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2YzZjVmZiIgb3BhY2l0eT0iMC41Ii8+CiAgPHBhdGggZD0iTTAgMHYxNTBoMjAwdjB6IiBmaWxsPSJub25lIi8+CiAgPHRleHQgeD0iMTAwIiB5PSI3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkludGVyLCBzaGVyaWQiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxZjI5MzciPgogICAg5Y2V5pa555+l77ya5LiW55WM6LWi55+lCiAgPC90ZXh0PgogIDx0ZXh0IHg9IjEwMCIgeT0iMTA1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iSW50ZXIsIHNoZXJpZCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzNmNDYzOSI+CiAgICA8cGF0aCBkPSJNMCA1aDIwMHYwTTUgMGgxOTB2MjAiIHN0cm9rZT0iIzNmNDYzOSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8cGF0aCBkPSJNMzAgMzBoMTQwdjUwTTAgMjVoMjAwdjAaIiBzdHJva2U9IiMzZjQ2Mzkic3Ryb2tlLXdpZHRoPSIyIi8+CiAgPC90ZXh0Pgo8L3N2Zz4=';

const mockAnswerImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2YzZjVmZiIgb3BhY2l0eT0iMC41Ii8+CiAgPHBhdGggZD0iTTAgMHYxNTBoMjAwdjB6IiBmaWxsPSJub25lIi8+CiAgPHRleHQgeD0iMTAwIiB5PSI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkludGVyLCBzaGVyaWQiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxZjI5MzciPgogICAg6YCa5p6c55+lCiAgPC90ZXh0PgogIDxwYXRoIGQ9Ik0zMCA2MGgxNDB2MzBNMCA1NWgyMDB2MCIgc3Ryb2tlPSIjMTRiZTFiIiBzdHJva2Utd2lkdGg9IjIiIC8+CiAgPHRleHQgeD0iMTAwIiB5PSI3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkludGVyLCBzaGVyaWQiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxNGJlMWIiPgogICAgKDEpIDxwYXRoIGQ9Ik02MCA2MGgxMHYxMEg2MHoiIHN0cm9rZT0iIzE0YmUxYiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC90ZXh0PgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iSW50ZXIsIHNoZXJpZCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzE0YmUxYiI+CiAgICAoMikgPHBhdGggZD0iTTYwIDkwSDkwIiBzdHJva2U9IiMxNGJlMWIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC90ZXh0Pgo8L3N2Zz4=';

// 模拟错题数据
function generateMockQuestions() {
    const mockQuestions = [
        {
            id: '1',
            name: '二次函数的图像和性质',
            category: '数学',
            notes: '这道题主要考察了二次函数的开口方向、顶点坐标、对称轴等基本性质，需要熟练掌握二次函数的表达式和图像特征。',
            questionImage: mockQuestionImage,
            answerImage: mockAnswerImage,
            answerNotes: '二次函数y=ax²+bx+c(a≠0)的图像是一条抛物线，当a>0时开口向上，当a<0时开口向下。顶点坐标为(-b/2a, (4ac-b²)/4a)，对称轴为直线x=-b/2a。',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天前
            reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
            status: 'mastered',
            reviewCount: 3,
            masteryLevel: 100
        },
        {
            id: '2',
            name: '英语时态填空',
            category: '英语',
            notes: '这道题考察了一般过去时和现在完成时的区别，需要注意时间状语对时态的影响。',
            questionImage: mockQuestionImage,
            answerImage: mockAnswerImage,
            answerNotes: '一般过去时表示过去某个时间发生的动作或存在的状态，常与yesterday, last week等时间状语连用；现在完成时表示过去发生的动作对现在造成的影响或结果，常与already, yet, since等时间状语连用。',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天前
            reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
            status: 'reviewed',
            reviewCount: 1,
            masteryLevel: 30
        },
        {
            id: '3',
            name: '牛顿第二定律的应用',
            category: '物理',
            notes: '这道题考察了牛顿第二定律F=ma的应用，需要正确分析物体的受力情况，并计算加速度。',
            questionImage: mockQuestionImage,
            answerImage: mockAnswerImage,
            answerNotes: '牛顿第二定律表明，物体的加速度与作用在它上面的合力成正比，与物体的质量成反比，加速度的方向与合力的方向相同。公式为F=ma，其中F是合力，m是质量，a是加速度。',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
            reviewedAt: null,
            status: 'pending',
            reviewCount: 0,
            masteryLevel: 0
        },
        {
            id: '4',
            name: '化学反应方程式配平',
            category: '化学',
            notes: '这道题考察了化学反应方程式的配平方法，需要掌握最小公倍数法、奇数配偶法等配平技巧。',
            questionImage: mockQuestionImage,
            answerImage: mockAnswerImage,
            answerNotes: '化学反应方程式配平的原则是质量守恒定律，即反应前后各元素的原子个数相等。常用的配平方法有最小公倍数法、奇数配偶法、观察法等。',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
            reviewedAt: null,
            status: 'pending',
            reviewCount: 0,
            masteryLevel: 0
        }
    ];
    
    return mockQuestions;
}

// 初始化模拟数据
function initMockData() {
    // 检查是否已有数据
    if (!localStorage.getItem('questions')) {
        const mockQuestions = generateMockQuestions();
        localStorage.setItem('questions', JSON.stringify(mockQuestions));
        console.log('模拟数据已初始化');
    }
}

// 在页面加载时初始化模拟数据
document.addEventListener('DOMContentLoaded', initMockData);