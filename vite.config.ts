import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import  path  from 'path'
// import electron from "vite-plugin-electron";
// import electron from '@xyh19/vite-plugin-electron'
// import electronRender from 'vite-plugin-electron-renderer'
// import requireTransform from 'vite-plugin-require-transform';
// import electron from '@xyh19/vite-plugin-electron'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // requireTransform({
    //   fileRegex: /.js$|.vue$/
    // }),
    // electron(
    //   {
    //     entry:"electron/main.js"
    //   }
    // ),
    // electronRender()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname,'./src')
    }
  },
  // optimizeDeps: {
  //    exclude: ['electron'], // 告诉 Vite 排除预构建 electron，不然会出现 __diranme is not defined\n  
  // },
  // define: {
  //   'process.env': {}
  // },
  base: '/ZNDS/',
  // base: './',
  // build: {
  //   outDir: 'ZNDS',
  // },
  
  // server: {
  //   // port: 4003,
  //   // host: '0.0.0.0',
  //   open: false, //设置服务器启动自动打开浏览器
  //   cors: true, //允许跨域
  //   proxy: {
  //     '/api': {
  //       target: 'http://192.168.31.233:9527',
  //       changeOrigin: true,
  //       ws: true,
  //       secure: false,
  //       rewrite: (path) => path.replace('^\/api/','/')
  //     },
  //     '/ws': {
  //         target: 'http://192.168.31.233:9527',
  //         ws: true,
  //         changeOrigin: true,
  //         rewrite: (path) => path.replace('^\/ws/','/')
  //     }
  //   },
    
  // },
  // preview: {
  //   port: 3001
  // }
})
