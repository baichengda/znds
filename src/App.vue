

<template >
    <router-view></router-view>
    <router-view name="bimModel"></router-view>

    <!-- <el-dialog
      title="正在更新新版本,请稍候..."
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="closeOnClickModal"
      :close-on-press-escape="closeOnPressEscape"
      :show-close="showClose"
      center
    >
      <div style="width:100%;height:15vh;line-height:15vh;text-align:center">
        <el-progress
          status="success"
          :text-inside="true"
          :stroke-width="20"
          :percentage="percentage"
          :width="strokeWidth"
          :show-text="true"
        ></el-progress>
      </div>
    </el-dialog> -->
    <!-- <div style="position: absolute; top: 0; color: #fff;font-size: 30px;z-index: 999;">
        <router-link style="color: #fff" :to="{name: 'floorOverview'}">楼层概览 </router-link>
        <router-link style="color: #fff" :to="{name: 'personnelQuery'}">人员查询 </router-link>
        <router-link style="color: #fff" :to="{name: 'instrumentQuery'}">仪器查询 </router-link>
        <router-link style="color: #fff" :to="{name: 'instrumentDetails'}">仪器详情 </router-link>
        <router-link style="color: #fff" :to="{name: 'relationshipsMap'}">关系图谱 </router-link>
    </div> -->
    <!-- <el-progress :percentage="percent" v-show="isShowProgress" class="dnyt_progress" :show-text="false" :duration="2" :indeterminate="true" /> -->
</template>

<!-- <script setup lang="ts">
import { http, userManagementApi } from '@/common/request.js'
//设备登录
let ruleForm = {

}
const submitFormDevice = () => {
    ruleForm['userPassword'] = ''
    ruleForm['userPhone'] = ''
    userManagementApi.post('userLogin/login', ruleForm)
    .then(res => {
        let { code,data } = res.data
        if(code==200) {
            localStorage.setItem('user_id',data.userId)
            // router.push({name:'monitoringCenter'})
        }else{
            // ElMessage.error(message)
        }
        // isHandleLogin.value = false
    })
}
// submitFormDevice()

document.addEventListener('touchmove',(event)=> {
    event.preventDefault();
},false)


</script> -->

<script lang="ts" setup>
import { http, userManagementApi } from '@/common/request.js'
import { useRouter } from 'vue-router'
import { watch, ref } from 'vue'
import { ElMessage } from 'element-plus'
const router = useRouter();
// setInterval(() => {
//     globalThis.electron?.ipcRenderer?.send('vueEvent')
// },20000)

globalThis.electron?.onUpdateCounter((e,arg)=>{
    console.log(123123,e,arg)
})
globalThis.electron?.onUpdateDownloaded((e,arg)=>{
    console.log(22222,e,arg)
})

globalThis.electron?.onDownloadProgress((e,arg)=>{
    console.log(33333,e,arg)
})

// const percent = ref(20)
// const isShowProgress = ref(true)
// setTimeout(() => {
//     isShowProgress.value=false
// },2000)

//一段时间不动返回屏保
//开启时间倒计时
const timer = ref(null)
const openTime = () => {
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
        router.push({
            path: '/screen-saver',
            query: { }
        });
    }, 500000)
}
    //倒计时

    //监听鼠标移动
    document.addEventListener('mousemove', (e) => {
        e.preventDefault();
        openTime()
    })
    //监听触摸事件
    let box = document.querySelector('body') // 监听对象
    box.addEventListener("touchstart", (e) => {
        openTime()
    })
    box.addEventListener('touchmove', (e) => {
        e.preventDefault();
        openTime()
    }, false)
    box.addEventListener('touchend', function (e) {
        openTime()
    })


//设备登录
let ruleForm = {

}
const submitFormDevice = () => {
    ruleForm['password'] = 'xkyqbp7CCxQx75FUVi0Iiw=='
    ruleForm['account'] = 'superadmin'
    userManagementApi.post('userLogin/login', ruleForm)
    .then(res => {
        let { code,data } = res.data
        if(code==200) {
            localStorage.setItem('user_id',data.id)
            // router.push({name:'monitoringCenter'})
        }else{
            // ElMessage.error(message)
        }
        // isHandleLogin.value = false
    })
}
submitFormDevice()

// setTimeout(() => {


// let ipcRenderer = window.versions.myIpcRenderer()
//     // events.send("checkForUpdate");

// //20秒后开始检测新版本
// let timeOut = window.setTimeout(() => {
//   ipcRenderer.send("checkForUpdate");
// }, 20000);
// // clearTimeout;
// //间隔1小时检测一次
// // let interval = window.setInterval(() => {
// //   ipcRenderer.send("checkForUpdate");
// // }, 3600000);
// const dialogVisible= ref(false)
// const closeOnClickModal= ref(false)
// const closeOnPressEscape= ref(false)
// const showClose= ref(false)
// const percentage=ref(0)
// const strokeWidth= ref(200)


// //接收主进程版本更新消息
// ipcRenderer.on("message", (event, arg) => {
//   // for (var i = 0; i < arg.length; i++) {
//   console.log(arg);
//   if ("update-available" == arg.cmd) {
//     //显示升级对话框
//     ipcRenderer.value = true;
//   } else if ("download-progress" == arg.cmd) {
//     //更新升级进度
//     /**
//      * 
//      * message{bytesPerSecond: 47673
//       delta: 48960
//       percent: 0.11438799862426002
//       total: 42801693
//       transferred: 48960
//       }
//      */
//     console.log(arg.message.percent);
//     let percent = Math.round(parseFloat(arg.message.percent));
//     percentage.value = percent;
//   } else if ("error" == arg.cmd) {
//     dialogVisible.value = false;
//     // this.$message("更新失败");
//     ElMessage("更新失败")

//   }
//   // }
// });
// ipcRenderer.send("checkForUpdate");
// },1000)
</script>

<style lang="scss">
#app {
    font-family: Source Han Sans CN-Regular, Source Han Sans CN,Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
    width: 100%;
    .dnyt_progress {
        position: absolute;
        top: 76px;
        z-index: 99999;
        width: 100%;
        .el-progress-bar__outer {
            background-color: #031138;
            height: 3px !important;
            .el-progress-bar__inner {
                background: rgba(0,255,255,0.4) !important;
            }
        }
    }
}

// .el-message {
//     font-size: 25px;
// }
</style>
