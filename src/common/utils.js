
const utils = {
    //点击导航标签跳动
    labelToBeat: (ids, className) => {
        var tempMarkup = $(className);
        var currElement
        for (var i = 0; i < tempMarkup.length; i++) {
            var dataId = tempMarkup[i].getAttribute('data-id')
                // console.log($(tempMarkup[i]).children('.xitong-icons'))
            if (dataId == ids) {
                $(tempMarkup[i]).siblings().children('.xitong-icons').removeClass('go-beat')
                $(tempMarkup[i]).children('.xitong-icons').addClass('go-beat')
                currElement = $(tempMarkup[i])
            }
        }
        if(currElement) {
            setTimeout(() => {
                currElement.children('.xitong-icons').removeClass('go-beat')
            },5000)
        }
        
    },
    //时间格式化
    formatDate(date, fmt = 'yyyy-MM-dd') {
        if (typeof(date) === 'number') {
            date = new Date(date)
        }
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
        return fmt
    },
    //深度克隆
    deepClone(target) {
        // 定义一个变量
        let result;
        // 如果当前需要深拷贝的是一个对象的话
        if (typeof target === 'object') {
            // 如果是一个数组的话
            if (Array.isArray(target)) {
                result = []; // 将result赋值为一个数组，并且执行遍历
                for (let i in target) {
                    // 递归克隆数组中的每一项
                    result.push(this.deepClone(target[i]))
                }
                // 判断如果当前的值是null的话；直接赋值为null
            } else if (target === null) {
                result = null;
                // 判断如果当前的值是一个RegExp对象的话，直接赋值    
            } else if (target.constructor === RegExp) {
                result = target;
            } else {
                // 否则是普通对象，直接for in循环，递归赋值对象的所有值
                result = {};
                for (let i in target) {
                    result[i] = this.deepClone(target[i]);
                }
            }
            // 如果不是对象的话，就是基本数据类型，那么直接赋值
        } else {
            result = target;
        }
        // 返回最终结果
        return result;
    },
}
export default utils;