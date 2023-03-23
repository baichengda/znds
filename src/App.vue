

<template >
    <router-view></router-view>
    <router-view name="bimModel"></router-view>
    <router-view name="filterNav"></router-view>
</template>

<script setup lang="ts">
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
}
// .el-message {
//     font-size: 25px;
// }
</style>
