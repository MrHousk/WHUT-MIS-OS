export function formatTime(time) {
    const d = new Date(time)
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分' + d.getSeconds() + '秒'
}

export function scrollTo(element) {
    clearInterval(timer);
    var timer = setInterval(function() {
        let target = element.scrollTop
        target -= Math.ceil(target / 20) //做减速运动
        element.scrollTo(0, target)
        if (target == 0) {
            clearInterval(timer)
        }
    }, 10)
}

export function conmentTime(time) {
    const now = Date.now()
    const diff = (now - time) / 1000

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) { // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }

    const d = new Date(time)
    return (d.getMonth() + 1) + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分' + d.getSeconds() + '秒'
}

export function map(config, key) {
    const map = Object.keys(config)
        // 对原有 config 的 Key(list) 进行逐个聚合处理
        // 初始值是一个空映射表（空对象）
        // 每次聚合过程会添加若干键值对，键不同，值相同
        .reduce((dict, keys) => {
            // 缓存目标值
            const target = config[keys];
            // 拆分 key(list)，逐个将每个 key 添加到映射表中
            keys.split("|").forEach(key => dict[key] = target);
            return dict;
        }, {});

    // 返回查询值
    return (function(key) {
        return map[key] || key;
    })(key);
};

export function isArrayDuplicate(array) {
    for (const item of array) {
        if (array.indexOf(item) !== array.lastIndexOf(item)) {
            return true;
        }
    }
    return false;
}

export function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}