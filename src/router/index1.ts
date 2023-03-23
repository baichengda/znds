import { createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

const routes:Array<RouteRecordRaw> = [
    {        
        name: "login",
        path: "/login",
        components:  {            
            default: () => import ('@/views/login/index.vue'),
        },
        meta:  {            
            title: '登录',
        },
    },
    {        
        name: "monitoringCenter",
        path: "/monitoring-center",
        components:  {            
            default: () => import ('@/views/monitoring-center/index.vue'),
            bimModel: () => import('@/views/bim-model/index.vue'),
            filterNav: () => import('@/views/side-nav/filter-nav.vue')
        },
        meta:  {            
            title: '监控中心',
        },
    },
    {
        path: '/',
        redirect: to => {
            return { path: '/login'}
          },
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    let is = true;
    let userId = localStorage.getItem('user_id');
    //获取用户信息，判断是否已登录
    if (userId || to.path == '/login') {
        next(); //表示已经登录(扫描二维码查看设备信息不需要验证)
    } else {
        //未登录
        next({
            name: "login",
        });
    }
})
export default router