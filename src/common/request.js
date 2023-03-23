import axios from 'axios'


//请求拦截器 
axios.interceptors.request.use((config) => {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        const token = window.localStorage.getItem('token');
        token && (config.headers.Authorization = token)
            //若请求方式为post，则将data参数转为JSON字符串
        if (config.method === 'POST') {
            config.data = JSON.stringify(config.data);
        }
        return config;
    }, (error) =>
    // 对请求错误做些什么
    Promise.reject(error));

//响应拦截器
axios.interceptors.response.use((response) => {
    //响应成功
    return response.data;
}, (error) => {
    console.log(error)
        //响应错误
    if (error.response && error.response.status) {
        const status = error.response.status
        switch (status) {
            case 400:
                message = '请求错误';
                break;
            case 401:
                message = '请求错误';
                break;
            case 404:
                message = '请求地址出错';
                break;
            case 408:
                message = '请求超时';
                break;
            case 500:
                message = '服务器内部错误!';
                break;
            case 501:
                message = '服务未实现!';
                break;
            case 502:
                message = '网关错误!';
                break;
            case 503:
                message = '服务不可用!';
                break;
            case 504:
                message = '网关超时!';
                break;
            case 505:
                message = 'HTTP版本不受支持';
                break;
            default:
                message = '请求失败'
        }
        ElMessage.error(message);
        return Promise.reject(error);
    }
    return Promise.reject(error);
});

// let host = window.location.hostname
let host = '192.168.31.233'
// 创建axios实例
export const http = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    // baseURL: 'http://10.243.1.200:9022/',
    baseURL: `http://${host}:9022/`,
    // 超时
    timeout: 20000
})

export const userManagementApi = axios.create({
    baseURL: `http://${host}:9021/`, //用户管理页面
    // baseURL: 'http://10.243.1.200:9021/', //用户管理页面
})


export const facilityManagementApi = axios.create({
        // baseURL: 'http://10.243.1.200:9024/', //设施管理页面
        baseURL: `http://${host}:9024/`, //设施管理页面
    })
    // export const facilityManagementUrl = 'http://10.243.1.200:9024/'
export const facilityManagementUrl = `http://${host}:9024/`

export const operationManagementApi = axios.create({
        // baseURL: 'http://10.243.1.200:9025/', //运行管理页面
        baseURL: `http://${host}:9025/`, //运行管理页面
    })
    // export const operationManagementWs = 'ws://10.243.1.200:9025/'
export const operationManagementWs = `ws://${host}:9025/`

//人员定位
export const personnelPositionApi = axios.create({
    baseURL: `http://${host}:9030/`,
    // baseURL: 'http://10.243.1.200:9030/',
})
export const personnelPositionWs = `ws://${host}:9030/`;
// export const personnelPositionWs = 'ws://10.243.1.200:9030/';