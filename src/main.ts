import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import '@/common/rem.js';

const app = createApp(App)
app.config.globalProperties.publicPath = import.meta.env.BASE_URL

app.config.globalProperties.$ws = window.isEnablePenetrationMode ? '/ws/9022/' : `${window.PROJECT_URL}:9022`;
app.config.globalProperties.$baseURL = window.isEnablePenetrationMode ? '/api/9022/' : `http://${window.PROJECT_URL}:9022/`;
app.config.globalProperties.loadPortURL = window.isEnablePenetrationMode ? '9527/9022': '9022';
app.config.globalProperties.portURL = window.isEnablePenetrationMode ? '9527/9022/' : '9022/';
console.log(process.env.NODE_ENV,import.meta.env.BASE_URL)


sessionStorage.setItem("appData", JSON.stringify(app.config.globalProperties))

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app
.use(router)
.use(ElementPlus)
.mount('#app')
