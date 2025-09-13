// 复习提醒系统的Mock数据
(function() {
    // 生成模拟错题数据
    function generateMockQuestions() {
        const categories = ['数学', '英语', '物理', '化学', '生物'];
        const questions = [];
        
        // 生成10道模拟错题
        for (let i = 0; i < 10; i++) {
            // 随机生成复习次数
            const reviewCount = Math.floor(Math.random() * 5);
            
            // 随机生成掌握状态
            let status = 'pending';
            if (reviewCount >= 3) {
                // 复习次数多的题目更可能被掌握
                status = Math.random() > 0.5 ? 'mastered' : 'pending';
            }
            
            // 计算上次复习时间
            let reviewedAt = null;
            if (reviewCount > 0) {
                const now = new Date();
                // 根据复习次数和状态设置不同的复习间隔
                let daysAgo;
                if (status === 'mastered') {
                    daysAgo = 15 + Math.floor(Math.random() * 20); // 15-35天前
                } else if (reviewCount >= 3) {
                    daysAgo = 8 + Math.floor(Math.random() * 12); // 8-20天前
                } else if (reviewCount >= 1) {
                    daysAgo = 4 + Math.floor(Math.random() * 6); // 4-10天前
                } else {
                    daysAgo = 1 + Math.floor(Math.random() * 3); // 1-4天前
                }
                
                const lastReview = new Date();
                lastReview.setDate(now.getDate() - daysAgo);
                reviewedAt = lastReview.toISOString();
            }
            
            // 创建错题对象
            questions.push({
                id: `question-${Date.now()}-${i}`,
                name: `模拟错题 ${i + 1}`,
                category: categories[Math.floor(Math.random() * categories.length)],
                image: null,
                note: `这是第${i + 1}道模拟错题的笔记内容。`,
                reviewedAt: reviewedAt,
                reviewCount: reviewCount,
                status: status,
                addedAt: new Date(Date.now() - Math.floor(Math.random() * 604800000)).toISOString(), // 随机添加时间（一周内）
                answer: {
                    image: null,
                    content: `这是第${i + 1}道模拟错题的答案解析。`
                }
            });
        }
        
        return questions;
    }
    
    // 保存模拟错题数据到localStorage
    function saveMockData() {
        // 检查是否已经存在数据
        const existingData = localStorage.getItem('questions');
        if (!existingData) {
            const mockQuestions = generateMockQuestions();
            localStorage.setItem('questions', JSON.stringify(mockQuestions));
            console.log('已保存模拟错题数据，共', mockQuestions.length, '道题');
        }
    }
    
    // 初始化函数
    function init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', saveMockData);
        } else {
            saveMockData();
        }
    }
    
    // 执行初始化
    init();
})();