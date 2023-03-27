<template>
    <div class="right">
        <div :class="[{'data-modal1': currentRoute},'date-modal']">
            <div class="now-time">{{nowTime}}</div>
            <!-- <div class="line"></div> -->
            <div class="now-week">
                <p>{{nowWeek}}&nbsp;</p>
                <p>{{nowDate}}123</p>
            </div>
        </div>
        <!-- <div :class="[{'changeStyle':!currentRoute},'head-portrait-style']">
            <Dropdown placement="bottom-end">
                <Avatar class="head-portrait" icon="ios-person" v-if="userPhoto" :src='headerUrl' />
                <Avatar :class="['head-portrait']" v-else>{{(userName.substring(0, 1)).toUpperCase()}}</Avatar>
                <DropdownMenu slot="list" style="text-align: center">
                    <DropdownItem>
                        <router-link :to="{name:'workOrder'}" style="color: #303447">我的工单</router-link>
                    </DropdownItem>
                    <DropdownItem>
                        <router-link :to="{name:'userCenter'}" style="color: #303447">我的信息</router-link>
                    </DropdownItem>
                    <DropdownItem @click.native="logOut">
                        <a href="javascript:;" style="color: #303447">退出系统</a>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div> -->
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import emitter from '@/common/mybus.ts'

import {http} from '@/common/request.js'
let { name } = useRoute()
let timer= ref<any>(null)
let nowWeek= ref('')//星期
let nowDate= ref('')//日期
let nowTime= ref('')//时间

let userName= ref('')
let headerUrl= ref('')
let userPhoto= ref('')

let currentRoute= false //根据路由判断返回值

onMounted(() => {
    emitter.on('getHeadUrl',(url)=>{
        getUserphoto();
    })
    timer.value = setInterval(() => {
        setNowTimes()
    }, 1000)
    getUserphoto();
    getPathName(name)
})

//获取路由信息
let getPathName = (name) => {
    switch(name) {
        case "monitoringCenter":
            currentRoute = false
        break;
        case "driving":
            currentRoute = false
        break;
        default :
            currentRoute = true
    }
}
//生成当前时间
let setNowTimes = () => {
    let myDate = new Date()
    // console.log(myDate)
    let wk = myDate.getDay()
    let yy = String(myDate.getFullYear())
    let mm = myDate.getMonth() + 1
    let dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate())
    let hou = String(myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours())
    let min = String(myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes())
    let sec = String(myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds())
    let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    let week = weeks[wk]
    // this.nowDate = yy + '-' + mm + '-' + dd
    nowDate.value =  mm + '月' + dd + '日'
    nowTime.value = hou + ':' + min
    nowWeek.value = week
}
//获取头像信息
let getUserphoto = () => {
    let formdata = new FormData();
    formdata.append('userId',localStorage.getItem('user_id'));
    http.post('userLogin/centreJoinSelect',
        formdata,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
    ).then((res)=> {
        if(res.data.success){
            userPhoto.value = res.data.data.userPhoto
            userName.value = res.data.data.userName
            headerUrl.value = this.$baseURL + res.data.data.userPhoto;
        }
        }).catch((error)=> {
            console.log(error);
        });
}
let logOut = (name) => {
    // let data = new FormData();
    // let id = localStorage.getItem('user_id');
    // data.append('id',id)
    // this.$userManagementApi.post('userLogin/loginout',data
    // ).then((res)=> {
    //     // localStorage.setItem("login", '');
    //     // this.$EventBus.$emit('logout',{})
    //     let code = res.data.code
    //     if(code==200) {
    //         this.$router.push('/login');
    //         localStorage.removeItem('Authorization'); //清除缓存得token
    //         localStorage.removeItem('user_id');
    //         sessionStorage.removeItem("btnPermissions") //清除缓存得权限
    //         localStorage.setItem('compnyName','')
    //     }
    //     // this.utils.delCookie('user_login')
    // }).catch((error)=> {
    //     console.log(error);
    // });
}

</script>
<style lang="scss" scoped>
    .right{
        display: flex;
        align-items: center;
        text-align: right;
        color: #fff;
        .date-modal {
            font-family: PingFangSC-Regular;
            margin-right: 15px;
            display: flex;
            align-items: center;
            .now-time {
                font-size: 34px;
                line-height: 1;
                margin-bottom: 2px;
                // letter-spacing: 0.5px;
                border-right: 1px solid #fff;
                margin-right: 10px;
                padding-right: 10px;
            }
            .now-week {
                font-size: 16px;
                // display: flex;
                // align-items: center;
                // justify-content: center;
                // flex-direction: column;
                text-align: left;
                transform: scale(0.9);
                width: auto;
                p {
                    line-height: 1;
                    margin: 0;
                    &:nth-child(1) {
                        margin-bottom: 4px;
                    }
                }
            }
        }
        .date-modal.data-modal1 {
            color: #303447;
        }
        .head-portrait {
            font-size: 16px;
            color: #0B182C;
            background-color: #58cfff;
            box-sizing: content-box;
            cursor: pointer;
            border: none;
            width: 34px;
            height: 34px;
            line-height: 34px;
            :deep(.ivu-avatar-string) {
                top: -1.5Px;
            }
            &::before{
                content: '';
                position: absolute;
                bottom: 5px;
                left: 50%;
                margin-left: -4px;
                border-style: solid;
                border-width: 4px 4px 0 4px;
                border-color: #0B182C transparent transparent transparent;
                width: 0;
                height: 0;
            }
        }
        .head-portrait-style {
            position: relative;
            z-index: 1;
            :deep(.ivu-select-dropdown) {
                .ivu-dropdown-menu {
                    // background: #fff;
                }
            }
        }
        // .head-portrait.head-portrait1 {
        //     color: #fff;
        //     background-color: #68759a;
        //     border-color: #68759a;
        //     box-shadow: none;
        //     border: 1.5Px solid #68759a;
        // }
        .changeStyle.head-portrait-style {
            // .head-portrait {
            //     border-radius: 50%;
            //     box-shadow: 0px 0px 8px 0px rgba(0, 143, 255, 0.6);
            //     border: 1.5Px solid rgba(0, 188, 255, 0.6);
            //     background-color: transparent;
            // }
            :deep(.ivu-select-dropdown) {
                background-color: rgba(3, 19, 64, 1);
                border: 1Px solid rgba(0, 188, 255, 0.6);
                box-shadow: 0 0 1px 0 rgba(0,143,255,0.6);
                a {
                    color: #fff !important;
                }
                .ivu-dropdown-item {
                    &:hover {
                        background: rgba(0, 188, 255, 0.2);
                    }
                }
            }
        }
    }
</style>