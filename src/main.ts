import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import '@/common/rem.js';

const app = createApp(App)
app.config.globalProperties.publicPath = import.meta.env.BASE_URL

// let host = window.location.host
let host = '192.168.31.233'

app.config.globalProperties.$ws = `ws://${host}:9022`;
app.config.globalProperties.$baseURL = `http://${host}:9022/`;
app.config.globalProperties.loadPortURL = '9022';
app.config.globalProperties.portURL = '9022/';
console.log(process.env.NODE_ENV,import.meta.env.BASE_URL)

// app.config.globalProperties.$ws = 'ws://192.168.31.233:9022';
// app.config.globalProperties.$baseURL = 'http://192.168.31.233:9022/';
// app.config.globalProperties.loadPortURL = '9022';
// app.config.globalProperties.portURL = '9022/';



sessionStorage.setItem("appData", JSON.stringify(app.config.globalProperties))

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app
.use(router)
.use(ElementPlus)
.mount('#app')
