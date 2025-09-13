// 复习提醒系统

// 默认配置
const defaultConfig = {
    reviewTime: '20:00', // 默认每天20:00提醒
    enableNotifications: true, // 默认启用通知
    notificationTitle: '错题本复习提醒', // 默认通知标题
    notificationMessage: '你有{count}道错题需要复习了，点击查看详情', // 默认通知消息
    notificationSound: false, // 默认不启用音效
    reminderFrequency: 'daily', // 默认每天提醒
    reminderDays: [], // 自定义提醒日，频率为custom时使用
    reminderIntervalStrategy: 'standard', // 默认标准复习间隔策略
    customIntervals: [1, 3, 7, 14, 30], // 自定义复习间隔（天）
    nextReminderTime: null // 下次提醒时间
};

// 存储配置
let reminderConfig = { ...defaultConfig };

// 初始化提醒系统
function initReviewReminder() {
    // 加载配置
    loadReviewSettings();
    
    // 检查浏览器通知权限
    checkNotificationPermission();
    
    // 初始化提醒定时器
    setupReminderTimer();
    
    // 监听配置变化
    setupConfigChangeListener();
}

// 加载复习设置
function loadReviewSettings() {
    try {
        const savedSettings = localStorage.getItem('reviewReminderSettings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            reminderConfig = { ...defaultConfig, ...convertSettingsToConfig(parsedSettings) };
        }
        
        // 如果没有设置下次提醒时间，计算并设置
        if (!reminderConfig.nextReminderTime || new Date(reminderConfig.nextReminderTime) <= new Date()) {
            updateNextReminderTime();
        }
    } catch (error) {
        console.error('加载复习设置失败:', error);
        reminderConfig = { ...defaultConfig };
        saveReviewSettings();
    }
}

// 将设置对象转换为配置对象
function convertSettingsToConfig(settings) {
    return {
        reviewTime: settings.notificationTime || defaultConfig.reviewTime,
        enableNotifications: settings.enableNotifications !== undefined ? settings.enableNotifications : defaultConfig.enableNotifications,
        notificationTitle: settings.notificationTitle || defaultConfig.notificationTitle,
        notificationMessage: settings.notificationMessage || defaultConfig.notificationMessage,
        notificationSound: settings.enableSound !== undefined ? settings.enableSound : defaultConfig.notificationSound,
        reminderFrequency: settings.reminderFrequency || defaultConfig.reminderFrequency,
        reminderDays: settings.reminderDays || defaultConfig.reminderDays,
        reminderIntervalStrategy: settings.reminderIntervalStrategy || defaultConfig.reminderIntervalStrategy,
        customIntervals: settings.customIntervals || defaultConfig.customIntervals,
        // 保持nextReminderTime不变
        nextReminderTime: reminderConfig.nextReminderTime
    };
}

// 保存复习设置
function saveReviewSettings() {
    try {
        // 构建设置对象（与app.js中的格式匹配）
        const settings = {
            enableNotifications: reminderConfig.enableNotifications,
            notificationTime: reminderConfig.reviewTime,
            reminderFrequency: reminderConfig.reminderFrequency,
            reminderDays: reminderConfig.reminderDays,
            reminderIntervalStrategy: reminderConfig.reminderIntervalStrategy,
            customIntervals: reminderConfig.customIntervals,
            enableSound: reminderConfig.notificationSound,
            notificationTitle: reminderConfig.notificationTitle,
            notificationMessage: reminderConfig.notificationMessage,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('reviewReminderSettings', JSON.stringify(settings));
    } catch (error) {
        console.error('保存复习设置失败:', error);
    }
}

// 更新下次提醒时间
function updateNextReminderTime() {
    try {
        const now = new Date();
        const [hours, minutes] = reminderConfig.reviewTime.split(':').map(Number);
        
        const nextReminder = new Date();
        nextReminder.setHours(hours, minutes, 0, 0);
        
        // 根据复习频率设置下次提醒时间
        if (nextReminder <= now || !isValidReminderDay(nextReminder)) {
            // 找到下一个有效的提醒日
            let daysToAdd = 1;
            while (true) {
                const testDate = new Date(nextReminder);
                testDate.setDate(testDate.getDate() + daysToAdd);
                
                if (isValidReminderDay(testDate)) {
                    nextReminder.setDate(nextReminder.getDate() + daysToAdd);
                    break;
                }
                
                daysToAdd++;
                // 防止无限循环，最多检查30天
                if (daysToAdd > 30) {
                    break;
                }
            }
        }
        
        reminderConfig.nextReminderTime = nextReminder.toISOString();
        saveReviewSettings();
        
        return nextReminder;
    } catch (error) {
        console.error('更新下次提醒时间失败:', error);
        return null;
    }
}

// 检查给定日期是否是有效的提醒日
function isValidReminderDay(date) {
    const dayOfWeek = date.getDay(); // 0-6，0是星期日
    const dayName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][dayOfWeek];
    
    switch (reminderConfig.reminderFrequency) {
        case 'daily':
            return true;
        case 'workdays':
            return dayOfWeek >= 1 && dayOfWeek <= 5; // 周一到周五
        case 'weekends':
            return dayOfWeek === 0 || dayOfWeek === 6; // 周六和周日
        case 'custom':
            return reminderConfig.reminderDays && reminderConfig.reminderDays.includes(dayName);
        default:
            return true;
    }
}

// 设置提醒定时器
function setupReminderTimer() {
    try {
        // 清除已有的定时器
        if (window.reminderTimer) {
            clearTimeout(window.reminderTimer);
        }
        
        // 如果没有启用提醒，直接返回
        if (!reminderConfig.enableNotifications) {
            return;
        }
        
        // 获取下次提醒时间
        let nextReminderTime = reminderConfig.nextReminderTime ? new Date(reminderConfig.nextReminderTime) : null;
        
        // 如果没有设置下次提醒时间或时间已过，更新它
        if (!nextReminderTime || nextReminderTime <= new Date()) {
            nextReminderTime = updateNextReminderTime();
        }
        
        if (!nextReminderTime) {
            return;
        }
        
        // 计算距离下次提醒的时间（毫秒）
        const timeUntilReminder = nextReminderTime - new Date();
        
        // 设置定时器
        window.reminderTimer = setTimeout(() => {
            // 检查是否有需要复习的错题
            const questionsToReview = getQuestionsToReview();
            
            if (questionsToReview.length > 0) {
                // 显示提醒通知
                showReminderNotification(questionsToReview);
            }
            
            // 更新下次提醒时间
            updateNextReminderTime();
            
            // 重新设置定时器
            setupReminderTimer();
        }, timeUntilReminder);
        
        console.log('复习提醒已设置，下次提醒时间:', nextReminderTime.toLocaleString());
    } catch (error) {
        console.error('设置提醒定时器失败:', error);
        // 出错时，5分钟后重试
        setTimeout(setupReminderTimer, 5 * 60 * 1000);
    }
}

// 获取需要复习的错题
function getQuestionsToReview() {
    try {
        // 从localStorage获取错题数据
        const savedQuestions = localStorage.getItem('questions');
        if (!savedQuestions) {
            return [];
        }
        
        const questions = JSON.parse(savedQuestions);
        const now = new Date();
        const questionsToReview = [];
        
        questions.forEach(question => {
            // 根据复习机制.md的要求进行判断
            if (shouldReviewQuestion(question, now)) {
                questionsToReview.push(question);
            }
        });
        
        return questionsToReview;
    } catch (error) {
        console.error('获取需要复习的错题失败:', error);
        return [];
    }
}

// 判断是否应该复习某道错题
function shouldReviewQuestion(question, currentTime) {
    try {
        // 如果是新添加的错题（从未复习过），需要复习
        if (!question.reviewedAt) {
            return true;
        }
        
        const lastReviewed = new Date(question.reviewedAt);
        const reviewCount = question.reviewCount || 0;
        const status = question.status || 'pending';
        
        // 计算距离上次复习的天数
        const daysSinceLastReview = (currentTime - lastReviewed) / (1000 * 60 * 60 * 24);
        
        // 根据复习间隔策略确定需要的间隔天数
        const requiredDays = getRequiredReviewInterval(reviewCount, status);
        
        return daysSinceLastReview >= requiredDays;
    } catch (error) {
        console.error('判断是否应该复习错题失败:', error);
        // 出错时，默认返回需要复习
        return true;
    }
}

// 获取所需的复习间隔天数
function getRequiredReviewInterval(reviewCount, status) {
    // 如果已经掌握，延长复习间隔
    if (status === 'mastered') {
        return 14; // 两周一次
    }
    
    // 根据复习间隔策略确定间隔天数
    switch (reminderConfig.reminderIntervalStrategy) {
        case 'standard':
            // 标准策略：根据复习次数递增
            if (reviewCount >= 3) return 7; // 7天
            if (reviewCount >= 1) return 3; // 3天
            return 1; // 1天
        case 'spaced':
            // 间隔重复策略：1, 3, 7, 14, 30天
            const intervals = [1, 3, 7, 14, 30];
            return intervals[Math.min(reviewCount, intervals.length - 1)];
        case 'custom':
            // 自定义间隔策略
            if (reminderConfig.customIntervals && reminderConfig.customIntervals.length > 0) {
                return reminderConfig.customIntervals[Math.min(reviewCount, reminderConfig.customIntervals.length - 1)] || 1;
            }
            return 1;
        default:
            return 1;
    }
}

// 检查浏览器通知权限
function checkNotificationPermission() {
    try {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                // 请求权限
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        console.log('通知权限已授予');
                    } else {
                        console.log('通知权限已拒绝');
                    }
                });
            }
        } else {
            console.warn('浏览器不支持通知功能');
        }
    } catch (error) {
        console.error('检查通知权限失败:', error);
    }
}

// 显示复习提醒通知
function showReminderNotification(questionsToReview) {
    try {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }
        
        const notification = new Notification(reminderConfig.notificationTitle, {
            body: reminderConfig.notificationMessage.replace('{count}', questionsToReview.length),
            icon: '/favicon.ico', // 可以替换为实际的图标路径
            badge: '/favicon.ico', // 可以替换为实际的图标路径
            tag: 'mistake-review-reminder',
            requireInteraction: true
        });
        
        // 点击通知打开应用
        notification.onclick = function() {
            window.focus();
            
            // 尝试自动定位到错题列表页面
            const questionsSection = document.getElementById('questions');
            if (questionsSection) {
                questionsSection.scrollIntoView({ behavior: 'smooth' });
            }
        };
        
        // 通知关闭时的处理
        notification.onclose = function() {
            console.log('复习提醒通知已关闭');
        };
    } catch (error) {
        console.error('显示复习提醒通知失败:', error);
        // 降级方案：显示一个页面内的提醒
        showPageReminder(questionsToReview);
    }
}

// 显示页面内的提醒（通知API不可用时的降级方案）
function showPageReminder(questionsToReview) {
    try {
        // 检查是否存在showSuccess函数（在app.js中定义）
        if (window.showSuccess) {
            window.showSuccess(`你有${questionsToReview.length}道错题需要复习！`);
        } else {
            // 如果showSuccess函数不存在，创建一个简单的提示元素
            const reminderElement = document.createElement('div');
            reminderElement.className = 'fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50';
            reminderElement.innerHTML = `
                <div class="font-bold">${reminderConfig.notificationTitle}</div>
                <div>${reminderConfig.notificationMessage.replace('{count}', questionsToReview.length)}</div>
                <button class="mt-2 text-xs bg-white text-blue-500 px-2 py-1 rounded" onclick="this.parentElement.remove()">知道了</button>
            `;
            document.body.appendChild(reminderElement);
            
            // 5秒后自动移除
            setTimeout(() => {
                if (reminderElement && reminderElement.parentNode) {
                    reminderElement.parentNode.removeChild(reminderElement);
                }
            }, 5000);
        }
    } catch (error) {
        console.error('显示页面内提醒失败:', error);
    }
}

// 设置配置变化监听器
function setupConfigChangeListener() {
    try {
        // 监听localStorage变化（在同一页面的不同标签页之间同步配置）
        window.addEventListener('storage', (event) => {
            if (event.key === 'reviewReminderSettings') {
                loadReviewSettings();
                setupReminderTimer();
            }
        });
    } catch (error) {
        console.error('设置配置变化监听器失败:', error);
    }
}

// 更新提醒配置
function updateReminderConfig(newConfig) {
    try {
        reminderConfig = { ...reminderConfig, ...newConfig };
        saveReviewSettings();
        
        // 如果关键设置发生变化，重新设置定时器
        if ('enableNotifications' in newConfig || 'reviewTime' in newConfig || 'reminderFrequency' in newConfig || 'reminderDays' in newConfig) {
            setupReminderTimer();
        }
        
        return true;
    } catch (error) {
        console.error('更新提醒配置失败:', error);
        return false;
    }
}

// 更新设置（从设置页面调用）
function updateReviewSettings(settings) {
    try {
        const config = convertSettingsToConfig(settings);
        return updateReminderConfig(config);
    } catch (error) {
        console.error('更新复习设置失败:', error);
        return false;
    }

// 获取当前提醒配置
function getReminderConfig() {
    return { ...reminderConfig };
}

// 计算距离下次提醒的时间
function getTimeUntilNextReminder() {
    try {
        if (!reminderConfig.nextReminderTime) {
            updateNextReminderTime();
        }
        
        const now = new Date();
        const nextReminder = new Date(reminderConfig.nextReminderTime);
        const timeUntil = nextReminder - now;
        
        // 格式化时间
        const hours = Math.floor(timeUntil / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
            return `${hours}小时${minutes}分钟`;
        } else if (minutes > 0) {
            return `${minutes}分钟`;
        } else {
            return '即将提醒';
        }
    } catch (error) {
        console.error('计算距离下次提醒时间失败:', error);
        return '未知';
    }
}

// 导出函数，供其他模块使用
window.ReviewReminder = {
    init: initReviewReminder,
    updateConfig: updateReminderConfig,
    updateSettings: updateReviewSettings,
    getConfig: getReminderConfig,
    getTimeUntilNextReminder: getTimeUntilNextReminder,
    setupReminderTimer: setupReminderTimer
};

// 当DOM加载完成后初始化复习提醒系统
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReviewReminder);
} else {
    initReviewReminder();
}