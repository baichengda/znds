<template>
    <div class="website-head">
        <div class="right">
            <slot></slot>
        </div>
        <div class="left">
            <span>{{ nowDate }}</span>
            <span>{{ nowWeek }}</span>
            <span>{{ nowTime }}</span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
let timer= ref<any>(null)
let nowWeek= ref('')//星期
let nowDate= ref('')//日期
let nowTime= ref('')//时间
onMounted(() => {
    timer.value = setInterval(() => {
        setNowTimes()
    }, 1000)
})
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
    nowDate.value = yy + '.' + mm + '.' + dd
    // nowDate.value =  mm + '月' + dd + '日'
    nowTime.value = hou + ':' + min +':' + sec
    nowWeek.value = week
}
setNowTimes()
</script>
<style lang="scss">
.website-head{
    width: 100%;
    height: 76px;
    background: linear-gradient(275deg, #083957 0%, rgba(8,57,87,0) 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 50px;
    box-sizing: border-box;
    .right {
        width: 340px;
        height: 100%;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .left {
        color: #fff;
        font-size: 28px;
        span {
            margin-left: 15px;
            font-family: 'HelveticaNeue-Regular';
            &:nth-child(2) {
                font-family: 'SourceHanSansCN-Regular';
            }
        }
    }
 }
</style>