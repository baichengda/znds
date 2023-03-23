import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import  path  from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname,'./src')
    }
  },
  // define: {
  //   'process.env': {}
  // },
  // base: '/XJDzhinengdaoshi/',
  base: './',
  // build: {
  //   outDir: 'XJDzhinengdaoshi',
  // },
  // server: {
  //   port: 4001,
  //   host: '0.0.0.0',
  //   open: false, //设置服务器启动自动打开浏览器
  //   cors: true, //允许跨域
  //   proxy: {
  //     '/api': {
  //       target: '',
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace('/api/','/')
  //     }
  //   },
    
  // },
  // preview: {
  //   port: 5000
  // }
})
