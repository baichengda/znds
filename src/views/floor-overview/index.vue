<template>
    <div class="monitoring">
        <Header>
            <slot>
                <img src="@/assets/images/title-img/floor-overview.png" alt="">
            </slot>
        </Header>
        <div class="left-module">
            <floorNav />
        </div>
        <div class="right-module">
            <rControl />
        </div>
        
    </div>
    <backButton class="floor-overview-button"/>
    <!-- <div class="goback" @click="goBack">
        返回
    </div> -->
    <!-- resizeViewer(Math.random()*100) -->
    <!-- <carousels ref="carousel" class="carouselModel"/> -->
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import rfunc from './r-func.vue'
// import carousels from './carousel.vue'
import Header from '@/components/header.vue'
import floorNav from '../floor-nav/index.vue'
import rControl from './r-control.vue'
import backButton from '@/components/back-botton.vue'
let carousel = ref<any>(null)
// const goBack = () => {
//     carousel.value.showCarousel()
// }

onMounted(()=>{
    document.addEventListener('touchmove', (event)=> {
        event.preventDefault();
    },false);
    $('.monitoring').each((index, el)=> {
    el.addEventListener('touchmove', (event) => {
        event.preventDefault();
    }, false);
});
}) 

let onChange = () => {

}
let onKeyPress = () => {

}
let maxWidth = 1024
let maxHeigh = 768


const resizeViewer = (event) => {
        let value = event;
        let viewer = (window as any).yst_viewer
        let viewWindow = (window as any).yst_viewer.clientContainer;
        let newWidth = "100%";
        let newHeight = "100%";

        viewWindow.style.width = `${(newWidth)}px`;
        viewWindow.style.height = `${(newHeight)}px`;


        viewer.canvas.width = newWidth;
        viewer.canvas.height = newHeight;


        viewer.container.style.width = `${(newWidth)}px`;
        viewer.container.style.height = `${(newHeight)}px`;
        viewer.resize(newWidth, newHeight);
}
</script>
<style lang="scss" scoped>
.monitoring {
    position: relative;
    z-index: 2;

    // header {
    //     width: auto;
    //     height: 94px;
    //     // padding: 17px 120px 0 70px;
    //     position: absolute;
    //     top: 0px;
    //     left: 0;
    //     right: 0;
    //     box-sizing: border-box;
    //     display: flex;
    //     align-items: center;
    //     justify-content: space-between;
    //     padding: 0 26px;
    //     .top-text {
    //         background-image: url('@/assets/images/top-bg.png');
    //         background-size: 100% 100%;
    //         background-repeat: no-repeat;
    //         width: 100%;
    //         flex: 1;
    //         margin: 0 10px;

    //         img {
    //             width: 38%;
    //             margin: 0 auto;
    //             // margin-left: 7.5%;
    //         }
    //     }
    // }

    .right-module {
        // position: absolute;
        // right: 36px;
        // top: 36px;
        position: relative;
        // display: flex;

    }
    .left-module {
        position: relative;
    }
    
}
.floor-overview-button {
    position: absolute;
    bottom: 60px;
    right: 40px;
    cursor: pointer;
    z-index: 9;
}
</style>