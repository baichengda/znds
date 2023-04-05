import { createRouter, createWebHistory,createWebHashHistory, RouteRecordRaw} from 'vue-router'
import { defineAsyncComponent, h } from "vue"

const routes:Array<RouteRecordRaw> = [
    // {
    //     name: "login",
    //     path: "/login",
    //     components: {
    //         default: () => import ('@/views/login/index.vue'),
    //     },
    //     meta: {
    //         title: '登录',
    //     },
    // },
    {
        name: "floorOverview",
        path: "/floor-overview",
        components: {
            default: () => import ('@/views/floor-overview/index.vue'),
            bimModel: () => import('@/views/bim-model/index.vue'),
            // filterNav: () => import('@/views/floor-nav/index.vue')
        },
        meta: {
            title: '楼层概览',
        },
    },
    {
        name: "personnelQuery",
        path: "/personnel-query",
        components: {
            default: () => import ('@/views/personnel-query/index.vue'),
            bimModel: () => import('@/views/bim-model/index.vue'),
        },
        meta: {
            title: '人员查询',
        },
    },
    {
        name: "instrumentQuery",
        path: "/instrument-query",
        components: {
            default: () => import ('@/views/instrument-query/index.vue'),
            bimModel: () => import('@/views/bim-model/index.vue'),
        },
        meta: {
            title: '仪器查询',
        },
    },
    {
        name: "instrumentDetails",
        path: "/instrument-details",
        components: {
            default: () => import('@/views/instrument-details/index.vue'),
            bimModel: () => import('@/views/bim-model/index.vue'),
        },
        meta: {
            title: '仪器详情',
        },
    },
    {
        name: "personnelDetails",
        path: "/personnel-details",
        components: {
            default: () => import('@/views/personnel-details/index.vue'),
            bimModel: () => import('@/views/bim-model/index.vue'),
        },
        meta: {
            title: '人员详情',
        },
    },
    {
        name: "relationshipsMap",
        path: "/relationships-map",
        components: {
            default: () => import('@/views/relationships-map/index.vue'),
            bimModel: () => import('@/views/bim-model/index.vue'),
        },
        meta: {
            title: '关系图谱',
        },
    },
    {
        name: "screenSaver",
        path: "/screen-saver",
        components: {
            default: () => import('@/views/screen-saver/index.vue'),
            bimModel: () => import('@/views/bim-model/index.vue'),
        },
        meta: {
            title: '关系图谱',
        },
    },
    {
        path: '/',
        redirect: '/screen-saver',
    },
]
// import.meta.env.BASE_URL
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router