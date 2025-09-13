// 全局变量
let currentQuestionId = null;
let questions = [];
let categories = ['数学', '英语', '物理', '化学'];
let currentSort = 'newest';
let currentCategory = 'all';
let currentSearch = '';

// DOM 元素
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const uploadQuestionBtn = document.getElementById('upload-question-btn');
const uploadQuestionModal = document.getElementById('upload-question-modal');
const closeQuestionModal = document.getElementById('close-question-modal');
const cancelUploadQuestion = document.getElementById('cancel-upload-question');
const uploadQuestionForm = document.getElementById('upload-question-form');
const uploadAnswerModal = document.getElementById('upload-answer-modal');
const closeAnswerModal = document.getElementById('close-answer-modal');
const cancelUploadAnswer = document.getElementById('cancel-upload-answer');
const uploadAnswerForm = document.getElementById('upload-answer-form');
const questionDetailModal = document.getElementById('question-detail-modal');
const closeDetailModal = document.getElementById('close-detail-modal');
const successToast = document.getElementById('success-toast');
const errorToast = document.getElementById('error-toast');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const questionsContainer = document.getElementById('questions-container');
const sortQuestions = document.getElementById('sort-questions');
const filterCategory = document.getElementById('filter-category');
const searchQuestions = document.getElementById('search-questions');
const questionImage = document.getElementById('question-image');
const questionPreview = document.getElementById('question-preview');
const questionImagePreview = document.getElementById('question-image-preview');
const answerImage = document.getElementById('answer-image');
const answerPreview = document.getElementById('answer-preview');
const answerImagePreview = document.getElementById('answer-image-preview');
const totalQuestions = document.getElementById('total-questions');
const masteredQuestions = document.getElementById('mastered-questions');
const reviewQuestions = document.getElementById('review-questions');
const navbar = document.getElementById('navbar');
const addCategoryBtn = document.getElementById('add-category-btn');

// 初始化
function init() {
    // 加载本地存储的数据
    loadData();
    
    // 初始化图表
    initCharts();
    
    // 绑定事件
    bindEvents();
    
    // 渲染错题列表
    renderQuestions();
    
    // 更新统计数据
    updateStats();
}

// 加载本地存储的数据
function loadData() {
    const savedQuestions = localStorage.getItem('questions');
    if (savedQuestions) {
        questions = JSON.parse(savedQuestions);
    }
    
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
        categories = JSON.parse(savedCategories);
    }
}

// 保存数据到本地存储
function saveData() {
    localStorage.setItem('questions', JSON.stringify(questions));
    localStorage.setItem('categories', JSON.stringify(categories));
}

// 绑定事件
function bindEvents() {
    // 移动端菜单
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // 上传错题相关事件
    uploadQuestionBtn.addEventListener('click', () => {
        uploadQuestionModal.classList.remove('hidden');
        resetQuestionForm();
    });
    
    closeQuestionModal.addEventListener('click', () => {
        uploadQuestionModal.classList.add('hidden');
    });
    
    cancelUploadQuestion.addEventListener('click', () => {
        uploadQuestionModal.classList.add('hidden');
    });
    
    uploadQuestionForm.addEventListener('submit', handleUploadQuestion);
    
    // 上传答案相关事件
    closeAnswerModal.addEventListener('click', () => {
        uploadAnswerModal.classList.add('hidden');
    });
    
    cancelUploadAnswer.addEventListener('click', () => {
        uploadAnswerModal.classList.add('hidden');
    });
    
    uploadAnswerForm.addEventListener('submit', handleUploadAnswer);
    
    // 查看错题详情相关事件
    closeDetailModal.addEventListener('click', () => {
        questionDetailModal.classList.add('hidden');
    });
    
    // 图片预览
    questionImage.addEventListener('change', handleQuestionImagePreview);
    answerImage.addEventListener('change', handleAnswerImagePreview);
    
    // 排序和筛选
    sortQuestions.addEventListener('change', handleSortChange);
    filterCategory.addEventListener('change', handleCategoryChange);
    searchQuestions.addEventListener('input', handleSearchChange);
    
    // 导航栏滚动效果
    window.addEventListener('scroll', handleScroll);
    
    // 添加分类
    addCategoryBtn.addEventListener('click', handleAddCategory);
}

// 处理滚动事件
function handleScroll() {
    if (window.scrollY > 10) {
        navbar.classList.add('shadow-md');
        navbar.classList.remove('shadow-sm');
    } else {
        navbar.classList.remove('shadow-md');
        navbar.classList.add('shadow-sm');
    }
}

// 重置错题表单
function resetQuestionForm() {
    uploadQuestionForm.reset();
    questionPreview.classList.add('hidden');
    currentQuestionId = null;
}

// 处理错题图片预览
function handleQuestionImagePreview(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            questionImagePreview.src = event.target.result;
            questionPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

// 处理答案图片预览
function handleAnswerImagePreview(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            answerImagePreview.src = event.target.result;
            answerPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

// 处理上传错题
function handleUploadQuestion(e) {
    e.preventDefault();
    
    const questionName = document.getElementById('question-name').value;
    const questionCategory = document.getElementById('question-category').value;
    const questionNotes = document.getElementById('question-notes').value;
    const questionImageFile = questionImage.files[0];
    
    if (!questionName || !questionImageFile) {
        showError('请填写错题名称并上传图片');
        return;
    }
    
    // 生成唯一ID
    const id = Date.now().toString();
    
    // 读取图片文件
    const reader = new FileReader();
    reader.onload = function(event) {
        // 创建错题对象
        const question = {
            id: id,
            name: questionName,
            category: questionCategory,
            notes: questionNotes,
            questionImage: event.target.result,
            answerImage: null,
            answerNotes: '',
            createdAt: new Date().toISOString(),
            reviewedAt: null,
            status: 'pending', // pending, reviewed, mastered
            reviewCount: 0,
            masteryLevel: 0 // 0-100
        };
        
        // 添加到数组
        questions.push(question);
        
        // 保存数据
        saveData();
        
        // 关闭模态框
        uploadQuestionModal.classList.add('hidden');
        
        // 显示成功提示
        showSuccess('错题上传成功，请上传答案');
        
        // 保存当前问题ID，用于上传答案
        currentQuestionId = id;
        
        // 打开上传答案模态框
        uploadAnswerModal.classList.remove('hidden');
        resetAnswerForm();
        
        // 重新渲染
        renderQuestions();
        updateStats();
        updateCharts();
    };
    reader.readAsDataURL(questionImageFile);
}

// 重置答案表单
function resetAnswerForm() {
    uploadAnswerForm.reset();
    answerPreview.classList.add('hidden');
}

// 处理上传答案
function handleUploadAnswer(e) {
    e.preventDefault();
    
    const answerNotes = document.getElementById('answer-notes').value;
    const answerImageFile = answerImage.files[0];
    
    if (!answerImageFile) {
        showError('请上传答案图片');
        return;
    }
    
    // 查找对应的问题
    const question = questions.find(q => q.id === currentQuestionId);
    
    if (!question) {
        showError('找不到对应的错题');
        return;
    }
    
    // 读取图片文件
    const reader = new FileReader();
    reader.onload = function(event) {
        // 更新问题对象
        question.answerImage = event.target.result;
        question.answerNotes = answerNotes;
        
        // 保存数据
        saveData();
        
        // 关闭模态框
        uploadAnswerModal.classList.add('hidden');
        
        // 显示成功提示
        showSuccess('答案上传成功');
        
        // 重新渲染
        renderQuestions();
        updateStats();
        updateCharts();
    };
    reader.readAsDataURL(answerImageFile);
}

// 处理排序变化
function handleSortChange(e) {
    currentSort = e.target.value;
    renderQuestions();
}

// 处理分类筛选变化
function handleCategoryChange(e) {
    currentCategory = e.target.value;
    renderQuestions();
}

// 处理搜索变化
function handleSearchChange(e) {
    currentSearch = e.target.value.toLowerCase();
    renderQuestions();
}

// 处理添加分类
function handleAddCategory() {
    const categoryName = prompt('请输入分类名称：');
    if (categoryName && categoryName.trim()) {
        if (categories.includes(categoryName.trim())) {
            showError('分类已存在');
            return;
        }
        categories.push(categoryName.trim());
        saveData();
        showSuccess('分类添加成功');
        // TODO: 更新分类选择器和分类列表
    }
}

// 渲染错题列表
function renderQuestions() {
    // 过滤和排序
    let filteredQuestions = [...questions];
    
    // 按分类过滤
    if (currentCategory !== 'all') {
        filteredQuestions = filteredQuestions.filter(q => q.category === currentCategory);
    }
    
    // 按搜索词过滤
    if (currentSearch) {
        filteredQuestions = filteredQuestions.filter(q => 
            q.name.toLowerCase().includes(currentSearch) || 
            q.notes.toLowerCase().includes(currentSearch)
        );
    }
    
    // 排序
    switch (currentSort) {
        case 'newest':
            filteredQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'oldest':
            filteredQuestions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'name-asc':
            filteredQuestions.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredQuestions.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }
    
    // 清空容器
    questionsContainer.innerHTML = '';
    
    // 如果没有错题
    if (filteredQuestions.length === 0) {
        questionsContainer.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-500">
                <i class="fa fa-book-open text-4xl mb-4"></i>
                <p>暂无错题，请点击"上传错题"按钮开始添加</p>
            </div>
        `;
        return;
    }
    
    // 渲染错题卡片
    filteredQuestions.forEach(question => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-md overflow-hidden transition-custom hover:shadow-lg transform hover:-translate-y-1';
        
        // 获取分类对应的颜色
        const categoryColor = getCategoryColor(question.category);
        
        card.innerHTML = `
            <div class="relative">
                <img src="${question.questionImage}" alt="${question.name}" class="w-full h-48 object-cover">
                <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium ${categoryColor}">
                    ${question.category}
                </div>
                <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                    ${formatDate(question.createdAt)}
                </div>
            </div>
            <div class="p-5">
                <h3 class="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">${question.name}</h3>
                <p class="text-gray-500 text-sm mb-4 line-clamp-2">${question.notes || '暂无笔记'}</p>
                <div class="flex justify-between items-center">
                    <div class="text-xs text-gray-500">
                        <i class="fa fa-eye mr-1"></i> 复习 ${question.reviewCount} 次
                    </div>
                    <div class="flex space-x-2">
                        <button class="view-question-btn px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20 transition-custom" data-id="${question.id}">
                            <i class="fa fa-search mr-1"></i> 查看
                        </button>
                        <button class="review-question-btn px-3 py-1 bg-secondary/10 text-secondary rounded-md text-sm hover:bg-secondary/20 transition-custom" data-id="${question.id}">
                            <i class="fa fa-refresh mr-1"></i> 复习
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        questionsContainer.appendChild(card);
    });
    
    // 绑定查看按钮事件
    document.querySelectorAll('.view-question-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const questionId = e.currentTarget.getAttribute('data-id');
            viewQuestionDetail(questionId);
        });
    });
    
    // 绑定复习按钮事件
    document.querySelectorAll('.review-question-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const questionId = e.currentTarget.getAttribute('data-id');
            reviewQuestion(questionId);
        });
    });
}

// 获取分类对应的颜色
function getCategoryColor(category) {
    const colorMap = {
        '数学': 'text-primary',
        '英语': 'text-blue-500',
        '物理': 'text-green-500',
        '化学': 'text-purple-500'
    };
    return colorMap[category] || 'text-gray-500';
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
}

// 查看错题详情
function viewQuestionDetail(questionId) {
    const question = questions.find(q => q.id === questionId);
    if (!question) {
        showError('找不到错题');
        return;
    }
    
    const detailContent = document.getElementById('detail-content');
    const detailTitle = document.getElementById('detail-modal-title');
    
    detailTitle.textContent = question.name;
    
    // 获取分类对应的颜色
    const categoryColor = getCategoryColor(question.category);
    
    detailContent.innerHTML = `
        <div class="space-y-6">
            <div class="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
                <span class="${categoryColor} bg-opacity-10 px-2 py-1 rounded-full font-medium">${question.category}</span>
                <span><i class="fa fa-calendar mr-1"></i> ${formatDate(question.createdAt)}</span>
                <span><i class="fa fa-eye mr-1"></i> 复习 ${question.reviewCount} 次</span>
                ${question.reviewedAt ? `<span><i class="fa fa-history mr-1"></i> 最近复习：${formatDate(question.reviewedAt)}</span>` : ''}
            </div>
            
            <div>
                <h4 class="text-base font-medium text-gray-700 mb-2">错题</h4>
                <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <img src="${question.questionImage}" alt="${question.name}" class="w-full h-auto rounded-md">
                    ${question.notes ? `<p class="mt-4 text-sm text-gray-600">${question.notes}</p>` : ''}
                </div>
            </div>
            
            ${question.answerImage ? `
            <div>
                <h4 class="text-base font-medium text-gray-700 mb-2">答案</h4>
                <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <img src="${question.answerImage}" alt="${question.name} 的答案" class="w-full h-auto rounded-md">
                    ${question.answerNotes ? `<p class="mt-4 text-sm text-gray-600">${question.answerNotes}</p>` : ''}
                </div>
            </div>
            ` : `
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50 text-center">
                <i class="fa fa-exclamation-circle text-gray-400 text-2xl mb-2"></i>
                <p class="text-gray-500">暂无答案</p>
            </div>
            `}
            
            <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                <button class="edit-question-btn px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-custom">
                    <i class="fa fa-pencil mr-1"></i> 编辑
                </button>
                <button class="delete-question-btn px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-custom">
                    <i class="fa fa-trash mr-1"></i> 删除
                </button>
            </div>
        </div>
    `;
    
    // 绑定编辑按钮事件
    document.querySelector('.edit-question-btn').addEventListener('click', () => {
        // TODO: 实现编辑功能
        showSuccess('编辑功能即将上线');
    });
    
    // 绑定删除按钮事件
    document.querySelector('.delete-question-btn').addEventListener('click', () => {
        if (confirm('确定要删除这道错题吗？')) {
            deleteQuestion(questionId);
            questionDetailModal.classList.add('hidden');
        }
    });
    
    // 显示详情模态框
    questionDetailModal.classList.remove('hidden');
}

// 删除错题
function deleteQuestion(questionId) {
    questions = questions.filter(q => q.id !== questionId);
    saveData();
    showSuccess('错题删除成功');
    renderQuestions();
    updateStats();
    updateCharts();
}

// 复习错题
function reviewQuestion(questionId) {
    const question = questions.find(q => q.id === questionId);
    if (!question) {
        showError('找不到错题');
        return;
    }
    
    // 更新复习次数和最近复习时间
    question.reviewCount += 1;
    question.reviewedAt = new Date().toISOString();
    
    // 根据复习次数更新掌握程度
    if (question.reviewCount === 1) {
        question.masteryLevel = 30;
        question.status = 'reviewed';
    } else if (question.reviewCount >= 3) {
        question.masteryLevel = 100;
        question.status = 'mastered';
        // 给予奖励
        giveReward('复习达人');
    } else {
        question.masteryLevel = 60;
        question.status = 'reviewed';
    }
    
    saveData();
    showSuccess('复习完成！');
    renderQuestions();
    updateStats();
    updateCharts();
}

// 给予奖励
function giveReward(rewardName) {
    // 这里可以实现奖励机制，如显示成就弹窗、更新成就徽章等
    showSuccess(`恭喜获得奖励：${rewardName}`);
}

// 更新统计数据
function updateStats() {
    // 总错题数
    totalQuestions.textContent = questions.length;
    
    // 已掌握的错题数
    const masteredCount = questions.filter(q => q.status === 'mastered').length;
    masteredQuestions.textContent = masteredCount;
    
    // 待复习的错题数
    const reviewCount = questions.filter(q => q.status === 'pending' || q.status === 'reviewed').length;
    reviewQuestions.textContent = reviewCount;
}

// 初始化图表
function initCharts() {
    // 学习进度图表
    const progressCtx = document.getElementById('progress-chart').getContext('2d');
    window.progressChart = new Chart(progressCtx, {
        type: 'line',
        data: {
            labels: generateLast7Days(),
            datasets: [{
                label: '新增错题',
                data: generateRandomData(7),
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    // 掌握情况图表
    const masteryCtx = document.getElementById('mastery-chart').getContext('2d');
    window.masteryChart = new Chart(masteryCtx, {
        type: 'bar',
        data: {
            labels: ['未复习', '复习中', '已掌握'],
            datasets: [{
                label: '错题数量',
                data: [
                    questions.filter(q => q.status === 'pending').length,
                    questions.filter(q => q.status === 'reviewed').length,
                    questions.filter(q => q.status === 'mastered').length
                ],
                backgroundColor: [
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(79, 70, 229, 0.7)',
                    'rgba(16, 185, 129, 0.7)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    // 分类占比图表
    const categoryCtx = document.getElementById('category-chart').getContext('2d');
    window.categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: categories.map(cat => questions.filter(q => q.category === cat).length),
                backgroundColor: [
                    'rgba(79, 70, 229, 0.7)',
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(168, 85, 247, 0.7)',
                    'rgba(244, 63, 94, 0.7)',
                    'rgba(245, 158, 11, 0.7)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 15
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// 更新图表
function updateCharts() {
    if (window.progressChart) {
        window.progressChart.data.datasets[0].data = generateRandomData(7);
        window.progressChart.update();
    }
    
    if (window.masteryChart) {
        window.masteryChart.data.datasets[0].data = [
            questions.filter(q => q.status === 'pending').length,
            questions.filter(q => q.status === 'reviewed').length,
            questions.filter(q => q.status === 'mastered').length
        ];
        window.masteryChart.update();
    }
    
    if (window.categoryChart) {
        window.categoryChart.data.datasets[0].data = categories.map(cat => questions.filter(q => q.category === cat).length);
        window.categoryChart.update();
    }
}

// 生成最近7天的日期标签
function generateLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }));
    }
    return days;
}

// 生成随机数据
function generateRandomData(count) {
    return Array(count).fill(0).map(() => Math.floor(Math.random() * 5));
}

// 显示成功提示
function showSuccess(message) {
    successMessage.textContent = message;
    successToast.classList.remove('translate-y-20', 'opacity-0');
    successToast.classList.add('translate-y-0', 'opacity-100');
    
    setTimeout(() => {
        successToast.classList.remove('translate-y-0', 'opacity-100');
        successToast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// 显示错误提示
function showError(message) {
    errorMessage.textContent = message;
    errorToast.classList.remove('translate-y-20', 'opacity-0');
    errorToast.classList.add('translate-y-0', 'opacity-100');
    
    setTimeout(() => {
        errorToast.classList.remove('translate-y-0', 'opacity-100');
        errorToast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', init);