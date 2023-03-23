<template>
    <div v-show="isShowCarousels" ref="carouselModel" class="carouselModel">
        <iframe scrolling="no" src="https://tianqiapi.com/api.php?style=tv&skin=grape&color=FFFFFF&fontsize=18"
            frameborder="0" width="150" height="25" id="iframe" class="weather-com" allowtransparency="true">
        </iframe>
        <div class="data-time">
            <img src="@/assets/images/carousel-icon/clock.png" alt="">
            <span>{{ nowDate }}</span>&nbsp;
            <span>{{ nowTime }}</span>
        </div>
        <el-carousel height="450px" ref="carousel" class="carousel" :initial-index="initIndex" arrow="always" :interval="5000" @change="currIndex">
            <div @touchstart="start($event)" @touchmove="move($event)">
                <el-carousel-item v-for="(item, index) in carouselArr" 
                    :key="item">
                    <h2>
                        <img src="@/assets/images/carousel-icon/logo.png" alt="">
                        <p>西安交通大学分析测试中心</p>
                    </h2>
                    <div class="carousel-single">
                        <ul>
                            <li @click="goQuery('空间')">
                                <p>
                                    <img src="@/assets/images/carousel-icon/carousel-icon1.png" alt="">
                                    <span>空间查询</span>
                                </p>
                                <p>快速找到您要去的实验室</p>
                            </li>
                            <li @click="goQuery('人员')">
                                <p>
                                    <img src="@/assets/images/carousel-icon/carousel-icon2.png" alt="">
                                    <span>人员查询</span>
                                </p>
                                <p>快速找到实验内的人员</p>
                            </li>
                            <li @click="goQuery('仪器')">
                                <p>
                                    <img src="@/assets/images/carousel-icon/carousel-icon3.png" alt="">
                                    <span>仪器查询</span>
                                </p>
                                <p>快速找到实验器材的位置</p>
                            </li>
                            <li @click="goQuery('设备')">
                                <p>
                                    <img src="@/assets/images/carousel-icon/carousel-icon4.png" alt="">
                                    <span>实验查询</span>
                                </p>
                                <p>快速找到实验空间</p>
                            </li>
                        </ul>
                    </div>
                    <video loop 
                    style="width: 100%;height: 100%;position: absolute;top:0;left:0;object-fit: none;z-index: -1" width="100%" ref="videoPlayer" 
                    :controls="isIn">
                        <source :src="`${item}`" type="video/mp4">
                    </video>
                </el-carousel-item>
            </div>
        </el-carousel>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import emitter from '@/common/mybus.ts'
import video1 from '@/assets/images/carousel-icon/video1.mp4'
import video2 from '@/assets/images/carousel-icon/video2.mp4'
import video3 from '@/assets/images/carousel-icon/video3.mp4'
import video4 from '@/assets/images/carousel-icon/video4.mp4'
// import weather1 from "@/components/weather.vue"; //天气
const carouselArr = reactive([
    // new URL('../../assets/images/carousel-icon/bg1', import.meta.url).href,
    // new URL('../../assets/images/carousel-icon/bg2', import.meta.url).href,
    // new URL('../../assets/images/carousel-icon/bg3', import.meta.url).href,
    video1,
    video2,
    video3,
    video4,
    // new URL('../../assets/images/carousel-icon/video3', import.meta.url).href,
])

const timer = ref(null)
const isShowCarousels = ref(false)

let carouselModel = ref(null)

//视频播放
const isIn = ref(false)
let videoPlayer = ref(null)
let initIndex = ref(0)

onMounted(() => {
    setInterval(() => {
        setNowTimes()
    }, 1000)

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
    },false)
    box.addEventListener('touchend', function (e) {
        openTime()
    })

    // let box1 = document.querySelector('.carouselModel') // 监听对象
    // box1.addEventListener('touchmove', (e) => {
    //     e.preventDefault();
    // },false)
    $('.carouselModel').each(function(index, el) {
        el.addEventListener('touchmove', function (event) {
            event.preventDefault();
        }, false);
    });

    // el.addEventListener('touchmove', function (event) {
    //     event.preventDefault();
    // }, false);
    // console.log(box)
    
})
//监听轮播事件
let currI = ref(0)
let currIndex = (index) => {
    currI.value = index
    playVideo(index)
}

//播放视频
const playVideo = (index) => {
    setTimeout(() => {
        videoPlayer.value[index]?.play();
    },200)
    
}

//开启时间倒计时
const openTime = () => {
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
        showCarousel()
    }, 500000)
}

//增加滑动滚动
let startX = ref(null)
let startY = ref(null)
let moveX = ref(null)
let moveY = ref(null)
let carousel = ref(null)
let startTime = ref(undefined)
let start = (e) => {
    startX.value = e.touches[0].clientX
    startY.value = e.touches[0].clientY
}

let move = (e) => {
    moveX.value = e.touches[0].clientX
    moveY.value = e.touches[0].clientY
    var nowtime = new Date().getTime()
    if (startTime.value == undefined || nowtime > startTime.value) {
        if (startX.value - moveX.value <= 0) { // 右滑触发
            carousel.value.prev()
            startTime.value = new Date().getTime() + 500;
            return false;
        } else {
            carousel.value.next();
            startTime.value = new Date().getTime() + 500;
            return false;
        }
    }
}
//点击查询
const goQuery = (query) => {
    isShowCarousels.value = false
    openTime()
    emitter.emit('sendSearchType', query)
}


//显示此页
let showCarousel = () => {
    isShowCarousels.value = true
    initIndex.value = 0
    playVideo(0)
}
defineExpose({
    showCarousel
})
//生成当前时间
let nowDate = ref('')
let nowTime = ref('')

let setNowTimes = () => {
    let myDate = new Date()
    let wk = myDate.getDay()
    let yy = String(myDate.getFullYear())
    let mm = myDate.getMonth() + 1
    let dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate())
    let hou = String(myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours())
    let min = String(myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes())
    let sec = String(myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds())
    let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    let week = weeks[wk]
    nowDate.value = yy + '-' + mm + '-' + dd
    nowTime.value = hou + ':' + min + ':' + sec
}


</script>

<style lang="scss" scoped>
//天气
.weather-com {
    position: absolute;
    top: 50px;
    left: 80px;
    z-index: 999;

    :deep(body) {
        font-size: 30px;
    }
}

// 时间
.data-time {
    position: absolute;
    right: 80px;
    top: 50px;
    z-index: 999;
    color: #fff;
    font-size: 24px;

    img {
        width: 40px;
        height: 40px;
        vertical-align: middle;
    }
}

// 轮播图
.carousel {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 15;
    height: 100%;
    width: 100%;
    background: #031138;
    :deep(.el-carousel__container) {
        height: 100% !important;

        .el-carousel__arrow {
            font-size: 40px;
            top: 38%;
            background-color: transparent;
        }

        .el-carousel__item {
            height: 100%;
            width: 100%;
            background-size: 100% 100%;
            background-repeat: no-repeat;

            h2 {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 10%;

                img {
                    width: 100px;
                    height: 100px;
                    margin-right: 20px;
                }

                p {
                    font-size: 90px;
                    font-family: Alibaba PuHuiTi-Regular, Alibaba PuHuiTi;
                    font-weight: 400;
                    color: #FFFFFF;
                }
            }
        }
    }

    .carousel-single {
        position: absolute;
        bottom: 120px;
        left: 0;
        right: 0;

        // margin-left: 879px;
        ul {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;

            li {
                width: 420px;
                height: 240px;
                background: #0768D4;
                border-radius: 4px 4px 4px 4px;
                display: inline-block;
                margin-right: 26px;

                &:last-child {
                    margin-right: 0;
                }

                p {
                    cursor: pointer;

                    &:nth-child(1) {
                        font-size: 36px;
                        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                        font-weight: 400;
                        color: #00FFFF;
                        margin: 18% 0 9%;
                    }

                    &:nth-child(2) {
                        font-size: 24px;
                        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                        font-weight: 400;
                        color: #FFFFFF;
                    }
                }

                img {
                    width: 40px;
                    margin-right: 5px;
                    vertical-align: middle;
                }
            }
        }

    }
}
</style>