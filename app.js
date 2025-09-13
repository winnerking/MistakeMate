// 全局变量
let currentQuestionId = null;
let questions = [];
let categories = ['数学', '英语', '物理', '化学'];
let currentSort = 'newest';
let currentCategory = 'all';
let currentSearch = '';
let userPoints = 0; // 用户积分
let pointHistory = []; // 积分历史记录
let gameActive = false; // 游戏是否活跃
let gameCards = []; // 游戏卡片数组
let currentViewCategory = null; // 当前查看的分类

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
const userPointsElement = document.getElementById('user-points');
const playGameBtn = document.getElementById('play-game-btn');

// 绑定事件（为了兼容原有代码）
function bindEvents() {
    // 原有代码中可能调用了这个函数，所以保留但实现为空
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
    
    // 确保"未分类"组始终存在
    if (!categories.includes('未分类')) {
        categories.unshift('未分类');
    }
    
    const savedPoints = localStorage.getItem('userPoints');
    if (savedPoints) {
        userPoints = JSON.parse(savedPoints);
    }
    
    const savedPointHistory = localStorage.getItem('pointHistory');
    if (savedPointHistory) {
        pointHistory = JSON.parse(savedPointHistory);
    }
}

// 保存数据到本地存储
function saveData() {
    localStorage.setItem('questions', JSON.stringify(questions));
    localStorage.setItem('categories', JSON.stringify(categories));
}

// 保存积分数据
function savePoints() {
    localStorage.setItem('userPoints', JSON.stringify(userPoints));
    localStorage.setItem('pointHistory', JSON.stringify(pointHistory));
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
    
    // AI分类按钮事件
    if(document.getElementById('auto-category-btn')) {
        document.getElementById('auto-category-btn').addEventListener('click', handleAutoCategory);
    }
    
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
    
    // 积分相关事件
    if(playGameBtn) {
        playGameBtn.addEventListener('click', handlePlayGame);
    }
    
    // 游戏相关事件
    const gameModal = document.getElementById('game-modal');
    const closeGameModal = document.getElementById('close-game-modal');
    if(closeGameModal) {
        closeGameModal.addEventListener('click', closeGame);
    }
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

// AI自动分类处理函数
function handleAutoCategory() {
    const questionName = document.getElementById('question-name').value.trim();
    const questionNote = document.getElementById('question-note').value.trim();
    const statusElement = document.getElementById('auto-category-status');
    const categorySelect = document.getElementById('question-category');
    const aiButton = document.getElementById('auto-category-btn');
    
    // 验证输入
    if (!questionName && !questionNote) {
        showError('请至少输入错题名称或错题笔记，以便AI进行分类');
        return;
    }
    
    // 显示加载状态
    if(statusElement) statusElement.classList.remove('hidden');
    if(aiButton) aiButton.disabled = true;
    
    // 构建请求数据
    const prompt = `根据以下信息确定这道题的学科分类，选项是：数学、英语、物理、化学。请只返回类别名称，不要包含其他解释。\n\n${questionName}\n${questionNote}`;
    
    // 调用DeepSeek AI API
    fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-d23e1fb667c147b7a47b02cc8e391129'
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: '你是一个智能分类助手，可以根据题目内容判断学科类别。' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 10
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`API调用失败: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // 处理AI返回的分类结果
        if (data.choices && data.choices.length > 0) {
            const categoryText = data.choices[0].message.content.trim();
            
            // 映射AI返回的文本到选项值
            const categoryMap = {
                '数学': 'math',
                '英语': 'english',
                '物理': 'physics',
                '化学': 'chemistry'
            };
            
            let categoryValue = categoryMap[categoryText];
            
            // 容错处理
            if (!categoryValue) {
                // 如果返回的内容不匹配预定义的类别，尝试根据关键词进行匹配
                const lowerText = categoryText.toLowerCase();
                if (lowerText.includes('数')) categoryValue = 'math';
                else if (lowerText.includes('英')) categoryValue = 'english';
                else if (lowerText.includes('物')) categoryValue = 'physics';
                else if (lowerText.includes('化')) categoryValue = 'chemistry';
            }
            
            // 更新分类选择
            if (categoryValue && categorySelect && categorySelect.querySelector(`option[value="${categoryValue}"]`)) {
                categorySelect.value = categoryValue;
                showSuccess(`AI已成功将题目分类为${categoryText}`);
            } else {
                showError('AI分类结果不明确，请手动选择分类');
            }
        } else {
            showError('未能获取AI分类结果');
        }
    })
    .catch(error => {
        console.error('AI分类错误:', error);
        showError(`AI分类失败: ${error.message || '未知错误'}`);
    })
    .finally(() => {
        // 隐藏加载状态，恢复按钮
        if(statusElement) statusElement.classList.add('hidden');
        if(aiButton) aiButton.disabled = false;
    });
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
        renderCategories(); // 更新分类列表
        updateCategoryFilter(); // 更新分类筛选器
        updateCharts(); // 更新图表
    }
}

// 处理删除分类
function handleDeleteCategory(categoryName) {
    // 不允许删除"未分类"组
    if (categoryName === '未分类') {
        showError('不允许删除"未分类"组');
        return;
    }
    
    if (confirm(`确定要删除"${categoryName}"分类吗？该分类下的所有错题将被移至"未分类"组。`)) {
        // 将该分类下的所有错题移至"未分类"组
        questions.forEach(question => {
            if (question.category === categoryName) {
                question.category = '未分类';
            }
        });
        
        // 从分类列表中删除该分类
        const index = categories.indexOf(categoryName);
        if (index > -1) {
            categories.splice(index, 1);
        }
        
        saveData();
        showSuccess('分类删除成功');
        renderCategories(); // 更新分类列表
        updateCategoryFilter(); // 更新分类筛选器
        updateCharts(); // 更新图表
        renderQuestions(); // 更新错题列表
    }
}

// 处理重命名分类
function handleRenameCategory(oldName) {
    // 不允许重命名"未分类"组
    if (oldName === '未分类') {
        showError('不允许重命名"未分类"组');
        return;
    }
    
    const newName = prompt('请输入新的分类名称：', oldName);
    if (newName && newName.trim() && newName !== oldName) {
        if (categories.includes(newName.trim())) {
            showError('分类名称已存在');
            return;
        }
        
        // 重命名分类下的所有错题
        questions.forEach(question => {
            if (question.category === oldName) {
                question.category = newName.trim();
            }
        });
        
        // 更新分类列表中的名称
        const index = categories.indexOf(oldName);
        if (index > -1) {
            categories[index] = newName.trim();
        }
        
        saveData();
        showSuccess('分类重命名成功');
        renderCategories(); // 更新分类列表
        updateCategoryFilter(); // 更新分类筛选器
        updateCharts(); // 更新图表
        renderQuestions(); // 更新错题列表
    }
}

// 处理查看分类详情
function handleViewCategoryDetails(categoryName) {
    currentViewCategory = categoryName;
    showCategoryDetailsModal();
}

// 渲染分类列表
function renderCategories() {
    const categoriesContainer = document.querySelector('#categories-container');
    if (!categoriesContainer) return;
    
    // 清空容器
    categoriesContainer.innerHTML = '';
    
    // 渲染每个分类
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        
        // 获取分类对应的颜色
        const borderColor = getCategoryBorderColor(category);
        
        // 计算分类内错题数量
        const questionCount = questions.filter(q => q.category === category).length;
        
        // 计算复习进度（已掌握和已复习的题目占比）
        const reviewedCount = questions.filter(q => q.category === category && (q.status === 'reviewed' || q.status === 'mastered')).length;
        const progressPercentage = questionCount > 0 ? Math.round((reviewedCount / questionCount) * 100) : 0;
        
        categoryCard.className = `bg-white rounded-xl shadow-md p-6 border-l-4 ${borderColor} transform hover:-translate-y-1 transition-custom cursor-pointer`;
        
        categoryCard.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-semibold text-gray-800">${category}</h3>
                <div class="flex space-x-2">
                    <button class="rename-category-btn text-gray-400 hover:text-gray-600 transition-custom" data-category="${category}">
                        <i class="fa fa-pencil"></i>
                    </button>
                    <button class="delete-category-btn text-gray-400 hover:text-red-500 transition-custom" data-category="${category}">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="text-gray-500 text-sm mb-4">包含 <span class="font-medium text-gray-700">${questionCount}</span> 道错题</p>
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="${getCategoryProgressColor(category)} h-2 rounded-full" style="width: ${progressPercentage}%"></div>
            </div>
        `;
        
        // 添加点击事件 - 查看分类详情
        categoryCard.addEventListener('click', (e) => {
            // 如果点击的是操作按钮，不触发查看详情
            if (e.target.closest('.rename-category-btn') || e.target.closest('.delete-category-btn') || 
                e.target.closest('.fa-pencil') || e.target.closest('.fa-trash')) {
                return;
            }
            handleViewCategoryDetails(category);
        });
        
        categoriesContainer.appendChild(categoryCard);
    });
    
    // 绑定重命名和删除按钮事件
    document.querySelectorAll('.rename-category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止冒泡
            const category = e.currentTarget.getAttribute('data-category');
            handleRenameCategory(category);
        });
    });
    
    document.querySelectorAll('.delete-category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止冒泡
            const category = e.currentTarget.getAttribute('data-category');
            handleDeleteCategory(category);
        });
    });
}

// 获取分类对应的边框颜色
function getCategoryBorderColor(category) {
    const colorMap = {
        '未分类': 'border-gray-300',
        '数学': 'border-primary',
        '英语': 'border-blue-500',
        '物理': 'border-green-500',
        '化学': 'border-purple-500'
    };
    
    // 如果是自定义分类，返回一个随机颜色
    if (!colorMap[category]) {
        const colors = ['border-indigo-500', 'border-pink-500', 'border-orange-500', 'border-yellow-500'];
        // 根据分类名称生成一个一致的随机数
        const seed = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const index = seed % colors.length;
        return colors[index];
    }
    
    return colorMap[category];
}

// 获取分类对应的进度条颜色
function getCategoryProgressColor(category) {
    const colorMap = {
        '未分类': 'bg-gray-400',
        '数学': 'bg-primary',
        '英语': 'bg-blue-500',
        '物理': 'bg-green-500',
        '化学': 'bg-purple-500'
    };
    
    // 如果是自定义分类，返回一个随机颜色
    if (!colorMap[category]) {
        const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-orange-500', 'bg-yellow-500'];
        // 根据分类名称生成一个一致的随机数
        const seed = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const index = seed % colors.length;
        return colors[index];
    }
    
    return colorMap[category];
}

// 获取分类对应的文本颜色
function getCategoryColor(category) {
    const colorMap = {
        '未分类': 'text-gray-600',
        '数学': 'text-primary',
        '英语': 'text-blue-600',
        '物理': 'text-green-600',
        '化学': 'text-purple-600'
    };
    
    // 如果是自定义分类，返回一个随机颜色
    if (!colorMap[category]) {
        const colors = ['text-indigo-600', 'text-pink-600', 'text-orange-600', 'text-yellow-600'];
        // 根据分类名称生成一个一致的随机数
        const seed = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const index = seed % colors.length;
        return colors[index];
    }
    
    return colorMap[category];
}

// 更新分类筛选器
function updateCategoryFilter() {
    const filterCategory = document.getElementById('filter-category');
    if (!filterCategory) return;
    
    // 保存当前选中的分类
    const currentValue = filterCategory.value;
    
    // 清空并重新添加选项
    filterCategory.innerHTML = '<option value="all">全部分类</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterCategory.appendChild(option);
    });
    
    // 恢复之前的选择，如果存在的话
    if (categories.includes(currentValue)) {
        filterCategory.value = currentValue;
    } else if (currentValue !== 'all') {
        filterCategory.value = 'all';
        currentCategory = 'all';
        renderQuestions();
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
    
    // 增加基础复习积分 (每复习一次获得10积分)
    addPoints(10, '复习错题');
    
    // 根据复习次数更新掌握程度
    if (question.reviewCount === 1) {
        question.masteryLevel = 30;
        question.status = 'reviewed';
    } else if (question.reviewCount >= 3) {
        question.masteryLevel = 100;
        question.status = 'mastered';
        // 给予额外奖励
        addPoints(20, '掌握知识点');
    } else {
        question.masteryLevel = 60;
        question.status = 'reviewed';
    }
    
    saveData();
    showSuccess('复习完成！获得10积分！');
    renderQuestions();
    updateStats();
    updateCharts();
    updatePointsDisplay();
}



// 添加积分
function addPoints(points, reason) {
    userPoints += points;
    
    // 记录积分历史
    pointHistory.push({
        points: points,
        reason: reason,
        type: 'gain',
        timestamp: new Date().toISOString()
    });
    
    // 保存积分数据
    savePoints();
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
    
    // 更新积分显示
    updatePointsDisplay();
}

// 更新积分显示
function updatePointsDisplay() {
    if(userPointsElement) {
        userPointsElement.textContent = userPoints;
    }
}

// 参与小游戏
function handlePlayGame() {
    if (userPoints < 50) {
        showError('积分不足，需要50积分才能参与小游戏');
        return;
    }
    
    // 扣除积分
    userPoints -= 50;
    
    // 记录积分历史
    pointHistory.push({
        points: 50,
        reason: '参与小游戏',
        type: 'spend',
        timestamp: new Date().toISOString()
    });
    
    // 保存积分数据
    savePoints();
    
    // 更新显示
    updatePointsDisplay();
    
    // 显示游戏开始提示
    showSuccess('已扣除50积分，游戏开始！');
    
    // 打开游戏模态框
    const gameModal = document.getElementById('game-modal');
    gameModal.classList.remove('hidden');
    
    // 初始化游戏
    initGame();
}

// 初始化游戏
function initGame() {
    gameActive = true;
    gameCards = [];
    const gameBoard = document.getElementById('game-board');
    const gameMessage = document.getElementById('game-message');
    gameBoard.innerHTML = '';
    gameMessage.textContent = '点击卡片找出奖励！';
    
    // 创建9张卡片
    for (let i = 0; i < 9; i++) {
        const card = document.createElement('div');
        card.className = 'bg-blue-100 hover:bg-blue-200 h-20 flex items-center justify-center cursor-pointer rounded transition-all';
        card.dataset.index = i;
        
        // 卡片背面内容
        const backContent = document.createElement('div');
        backContent.className = 'text-blue-500 font-bold';
        backContent.textContent = '?';
        card.appendChild(backContent);
        
        // 添加点击事件
        card.addEventListener('click', () => handleCardClick(card, i));
        
        gameBoard.appendChild(card);
        gameCards.push(card);
    }
    
    // 随机设置奖励卡片位置
    const rewardPosition = Math.floor(Math.random() * 9);
    let punishmentPosition = Math.floor(Math.random() * 9);
    
    // 确保奖励和惩罚位置不同
    while (punishmentPosition === rewardPosition) {
        punishmentPosition = Math.floor(Math.random() * 9);
    }
    
    // 存储游戏状态
    gameBoard.dataset.rewardPosition = rewardPosition;
    gameBoard.dataset.punishmentPosition = punishmentPosition;
}

// 处理卡片点击
function handleCardClick(card, index) {
    if (!gameActive || card.classList.contains('flipped')) {
        return;
    }
    
    // 标记卡片为已翻转
    card.classList.add('flipped');
    
    const gameBoard = document.getElementById('game-board');
    const rewardPosition = parseInt(gameBoard.dataset.rewardPosition);
    const punishmentPosition = parseInt(gameBoard.dataset.punishmentPosition);
    
    // 清空卡片内容
    card.innerHTML = '';
    
    // 判断点击的卡片类型
    if (index === rewardPosition) {
        // 奖励卡片
        card.className = 'bg-green-200 h-20 flex items-center justify-center rounded transition-all';
        const rewardContent = document.createElement('div');
        rewardContent.className = 'text-center';
        rewardContent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg><p class="text-green-600 text-sm">恭喜!</p>';
        card.appendChild(rewardContent);
        
        // 延迟显示结果
        setTimeout(() => {
            finishGame(true);
        }, 1000);
    } else if (index === punishmentPosition) {
        // 惩罚卡片
        card.className = 'bg-red-200 h-20 flex items-center justify-center rounded transition-all';
        const punishmentContent = document.createElement('div');
        punishmentContent.className = 'text-center';
        punishmentContent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg><p class="text-red-600 text-sm">再接再厉</p>';
        card.appendChild(punishmentContent);
        
        // 延迟显示结果
        setTimeout(() => {
            finishGame(false);
        }, 1000);
    } else {
        // 普通卡片
        card.className = 'bg-gray-200 h-20 flex items-center justify-center rounded transition-all';
        const normalContent = document.createElement('div');
        normalContent.className = 'text-gray-500';
        normalContent.textContent = '继续';
        card.appendChild(normalContent);
    }
}

// 游戏结束处理
function finishGame(isWinner) {
    gameActive = false;
    
    const gameBoard = document.getElementById('game-board');
    const gameMessage = document.getElementById('game-message');
    
    // 显示所有卡片
    const rewardPosition = parseInt(gameBoard.dataset.rewardPosition);
    const punishmentPosition = parseInt(gameBoard.dataset.punishmentPosition);
    
    gameCards.forEach((card, index) => {
        if (!card.classList.contains('flipped')) {
            card.classList.add('flipped');
            card.innerHTML = '';
            
            if (index === rewardPosition) {
                card.className = 'bg-green-200 h-20 flex items-center justify-center rounded transition-all';
                const rewardContent = document.createElement('div');
                rewardContent.className = 'text-center';
                rewardContent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg><p class="text-green-600 text-sm">奖励!</p>';
                card.appendChild(rewardContent);
            } else if (index === punishmentPosition) {
                card.className = 'bg-red-200 h-20 flex items-center justify-center rounded transition-all';
                const punishmentContent = document.createElement('div');
                punishmentContent.className = 'text-center';
                punishmentContent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg><p class="text-red-600 text-sm">惩罚</p>';
                card.appendChild(punishmentContent);
            } else {
                card.className = 'bg-gray-200 h-20 flex items-center justify-center rounded transition-all';
                const normalContent = document.createElement('div');
                normalContent.className = 'text-gray-500';
                normalContent.textContent = '-';
                card.appendChild(normalContent);
            }
        }
    });
    
    // 根据游戏结果显示消息并发放奖励
    if (isWinner) {
        gameMessage.textContent = '恭喜你赢了！';
        // 游戏获胜，奖励额外积分（20-50积分）
        const rewardPoints = Math.floor(Math.random() * 30) + 20;
        addPoints(rewardPoints, '小游戏获胜');
        showSuccess(`游戏获胜！获得${rewardPoints}积分奖励！`);
    } else {
        gameMessage.textContent = '游戏结束，再接再厉！';
        showError('游戏失败，再接再厉！');
    }
    
    // 更新显示
    updatePointsDisplay();
    
    // 3秒后自动关闭游戏模态框
    setTimeout(() => {
        closeGame();
    }, 3000);
}

// 关闭游戏模态框
function closeGame() {
    const gameModal = document.getElementById('game-modal');
    gameModal.classList.add('hidden');
    gameActive = false;
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

// 显示分类详情模态框
function showCategoryDetailsModal() {
    if (!currentViewCategory) return;
    
    const modal = document.getElementById('category-details-modal');
    const modalTitle = document.getElementById('category-details-title');
    const totalQuestionsCount = document.getElementById('total-questions-count');
    const masteredQuestionsCount = document.getElementById('mastered-questions-count');
    const reviewProgressPercentage = document.getElementById('review-progress-percentage');
    const questionsList = document.getElementById('category-questions-list');
    
    // 设置模态框标题
    modalTitle.textContent = `${currentViewCategory} 详情`;
    
    // 获取分类下的所有错题
    const categoryQuestions = questions.filter(q => q.category === currentViewCategory);
    const masteredCount = categoryQuestions.filter(q => q.status === 'mastered').length;
    const reviewedCount = categoryQuestions.filter(q => q.status === 'reviewed' || q.status === 'mastered').length;
    const progressPercentage = categoryQuestions.length > 0 ? Math.round((reviewedCount / categoryQuestions.length) * 100) : 0;
    
    // 更新统计信息
    totalQuestionsCount.textContent = categoryQuestions.length;
    masteredQuestionsCount.textContent = masteredCount;
    reviewProgressPercentage.textContent = `${progressPercentage}%`;
    
    // 渲染错题列表
    if (categoryQuestions.length === 0) {
        questionsList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <p>暂无错题</p>
            </div>
        `;
    } else {
        // 按状态和复习次数排序：未复习的在前，然后是复习中的，最后是已掌握的
        const sortedQuestions = [...categoryQuestions].sort((a, b) => {
            const statusOrder = { 'pending': 0, 'reviewed': 1, 'mastered': 2 };
            if (statusOrder[a.status] !== statusOrder[b.status]) {
                return statusOrder[a.status] - statusOrder[b.status];
            }
            // 同状态按复习次数排序
            return (a.reviewCount || 0) - (b.reviewCount || 0);
        });
        
        questionsList.innerHTML = '';
        sortedQuestions.forEach(question => {
            // 获取分类对应的颜色
            const categoryColor = getCategoryColor(question.category);
            
            // 根据状态获取对应的样式和文本
            let statusClass = '';
            let statusText = '';
            
            switch(question.status) {
                case 'pending':
                    statusClass = 'bg-yellow-100 text-yellow-800';
                    statusText = '未复习';
                    break;
                case 'reviewed':
                    statusClass = 'bg-blue-100 text-blue-800';
                    statusText = '复习中';
                    break;
                case 'mastered':
                    statusClass = 'bg-green-100 text-green-800';
                    statusText = '已掌握';
                    break;
            }
            
            const questionItem = document.createElement('div');
            questionItem.className = 'border border-gray-200 rounded-lg p-4 hover:shadow-md transition-custom cursor-pointer';
            questionItem.dataset.questionId = question.id;
            
            questionItem.innerHTML = `
                <div class="flex flex-wrap items-center gap-2 text-sm mb-3">
                    <span class="${categoryColor} bg-opacity-10 px-2 py-1 rounded-full font-medium">${question.category}</span>
                    <span class="${statusClass} px-2 py-1 rounded-full font-medium">${statusText}</span>
                    <span><i class="fa fa-calendar mr-1"></i> ${formatDate(question.createdAt)}</span>
                </div>
                <h5 class="font-medium text-gray-800 mb-2">${question.name}</h5>
                <div class="flex justify-between items-center text-sm text-gray-500">
                    <span>复习 ${question.reviewCount || 0} 次</span>
                    <span class="text-primary">查看详情 →</span>
                </div>
            `;
            
            // 添加点击事件
            questionItem.addEventListener('click', () => {
                viewQuestionDetail(question.id);
            });
            
            questionsList.appendChild(questionItem);
        });
    }
    
    // 显示模态框
    modal.classList.remove('hidden');
}

// 关闭分类详情模态框
function closeCategoryDetailsModal() {
    const modal = document.getElementById('category-details-modal');
    modal.classList.add('hidden');
    currentViewCategory = null;
}

// 开始复习分类
function studyCategory() {
    if (!currentViewCategory) return;
    
    // 筛选出该分类下未掌握的错题
    const categoryQuestions = questions.filter(q => q.category === currentViewCategory && q.status !== 'mastered');
    
    if (categoryQuestions.length === 0) {
        showSuccess('该分类下的所有错题都已掌握！');
        closeCategoryDetailsModal();
        return;
    }
    
    // 关闭详情模态框
    closeCategoryDetailsModal();
    
    // 筛选显示该分类的错题
    currentCategory = currentViewCategory;
    renderQuestions();
    
    // 滚动到错题列表
    const questionsSection = document.getElementById('questions');
    if (questionsSection) {
        questionsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    showSuccess(`开始复习 ${currentViewCategory} 分类，共有 ${categoryQuestions.length} 道题需要复习`);
}

// 初始化分类详情模态框事件
function initCategoryDetailsModal() {
    const modal = document.getElementById('category-details-modal');
    const closeBtn = document.getElementById('close-category-details-modal');
    const studyBtn = document.getElementById('study-category-btn');
    
    // 关闭按钮事件
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCategoryDetailsModal);
    }
    
    // 学习按钮事件
    if (studyBtn) {
        studyBtn.addEventListener('click', studyCategory);
    }
    
    // 点击模态框背景关闭
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeCategoryDetailsModal();
            }
        });
    }
}

// 初始化应用
function init() {
    // 加载数据
    loadData();
    
    // 初始化图表
    initCharts();
    
    // 初始化分类详情模态框
    initCategoryDetailsModal();
    
    // 绑定事件
    document.getElementById('add-category-btn')?.addEventListener('click', handleAddCategory);
    document.getElementById('play-game-btn')?.addEventListener('click', handlePlayGame);
    document.getElementById('close-game-modal')?.addEventListener('click', closeGame);
    document.getElementById('filter-category')?.addEventListener('change', handleCategoryChange);
    document.getElementById('sort-questions')?.addEventListener('change', renderQuestions);
    document.getElementById('search-questions')?.addEventListener('input', renderQuestions);
    
    // 渲染页面
    renderQuestions();
    updateStats();
    renderCategories(); // 渲染分类列表
    updateCategoryFilter(); // 更新分类筛选器
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', init);